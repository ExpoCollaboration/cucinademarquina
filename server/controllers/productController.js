// Define routes to use the controller functions, importing FileSystem and Path
import Product from '../models/productModel.js';
import path from 'path';
import fs from 'fs';
import "dotenv/config"

// Controller function to get all products
export const getAllProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Controller function to get a product by ID
export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!response) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Controller function to save a new product
export const saveProduct = async (req, res) => {
    // Check if req.files is undefined or null
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "No File Uploaded" });
    }

    const { name, price, quantity, category, outOfStock, description } = req.body;
    const file = req.files.file;

    // File details
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Extension" });
    }

    if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
    }

    // Absolute path to save images
    const uploadDir = path.join(process.cwd(), 'public/productImages/');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const url = `${process.env.ORIGIN}/productImages/${fileName}`;

    file.mv(path.join(uploadDir, fileName), async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "File Upload Error" });
        }

        try {
            await Product.create({
                name,
                price,
                quantity,
                category,
                outOfStock,
                description,
                image: fileName,
                url,
                createdDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return res.status(201).json({ msg: "Product Created Successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Database Error" });
        }
    });
};

// Controller function to update a product
export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = product.image;
    } else {
        // Check if req.files is undefined or null
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No File Uploaded" });
        }

        const { name, price, quantity, category, outOfStock, description } = req.body;
        const file = req.files.file;

        // File details
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        if (!allowedTypes.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "Invalid Image Extension" });
        }

        if (fileSize > 5000000) {
            return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        // Absolute path to save images
        const uploadDir = path.join(process.cwd(), 'public/images/');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const url = `${process.env.ORIGIN}/images/${fileName}`;

        file.mv(path.join(uploadDir, fileName), async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "File Upload Error" });
            }

            try {
                await Product.update({
                    name,
                    price,
                    quantity,
                    category,
                    outOfStock,
                    description,
                    image: fileName,
                    url,
                    createdDate: new Date(),
                    updatedAt: new Date()
                }, {
                    where: {
                        id: req.params.id
                    }
                });

                return res.status(201).json({ msg: "Product Updated Successfully" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ msg: "Database Error" });
            }
        });
    }
};

// Controller function to delete a product
export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/productImages/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" + error });
    }
};