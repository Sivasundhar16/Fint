import Product from "../models/add.model.js";
import * as yup from "yup";
import ApiRes from "../service/apires.js";

export const getAllAdds = async (req, res) => {
  try {
    const products = await Product.find();
    return ApiRes(res, 200, "Products fetched successfully", {
      count: products.length,
      products,
    });
  } catch (error) {
    return ApiRes(res, 500, "Failed to fetch products", {
      error: error.message,
    });
  }
};

export const postAdds = async (req, res) => {
  const productSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    imageUrl: yup
      .string()
      .url("Invalid image URL")
      .required("Image URL is required"),
  });

  try {
    const { title, description, imageUrl } = await productSchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (!req.user || !req.user._id) {
      return ApiRes(res, 401, "Unauthorized");
    }

    const newProduct = new Product({
      title,
      description,
      imageUrl,
      merchant: req.user._id,
    });

    const savedProduct = await newProduct.save();

    return ApiRes(res, 201, "Product created successfully", {
      product: savedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return ApiRes(res, 400, "Validation failed", { errors });
    }
    console.log(error);
    return ApiRes(res, 500, "Server error", { error: error.message });
  }
};

export const getSingleAdd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ApiRes(res, 400, "Product ID is required");
    }

    const product = await Product.findById(id);

    if (!product) {
      return ApiRes(res, 404, "Product not found");
    }

    return ApiRes(res, 200, "Product fetched successfully", {
      product,
    });
  } catch (error) {
    return ApiRes(res, 500, "Failed to fetch product", {
      error: error.message,
    });
  }
};

export const updateAdd = async (req, res) => {
  const { id } = req.params;

  const productSchema = yup.object({
    title: yup.string().optional(),
    description: yup.string().optional(),
    imageUrl: yup.string().url("Invalid image URL").optional(),
    status: yup.string().oneOf(["active", "removed"]).optional(),
  });

  try {
    // Validate input
    const updates = await productSchema.validate(req.body, {
      abortEarly: false,
    });

    // Find the product
    const product = await Product.findById(id);

    if (!product) {
      return ApiRes(res, 404, "Product not found");
    }

    // Check if the current user is the owner
    if (!req.user || product.merchant.toString() !== req.user._id.toString()) {
      return ApiRes(res, 403, "Unauthorized to update this product");
    }

    // Update the product fields
    Object.assign(product, updates);

    // Save changes
    const updatedProduct = await product.save();

    return ApiRes(res, 200, "Product updated successfully", {
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return ApiRes(res, 400, "Validation failed", { errors });
    }
    console.error(error);
    return ApiRes(res, 500, "Server error", { error: error.message });
  }
};

export const deleteAdd = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return ApiRes(res, 400, "Product ID is required");
  }

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return ApiRes(res, 404, "Product not found");
    }

    // Check if the user is the product's merchant
    if (!req.user || product.merchant.toString() !== req.user._id.toString()) {
      return ApiRes(res, 403, "Unauthorized to delete this product");
    }

    // Soft delete by updating status
    product.status = "removed";
    await product.save();

    return ApiRes(res, 200, "Product deleted (status set to removed)");
  } catch (error) {
    console.error(error);
    return ApiRes(res, 500, "Server error", { error: error.message });
  }
};
