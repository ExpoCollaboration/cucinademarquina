import Category from '../models/categoryModel.js';
import path from 'path';
import fs from 'fs';
import "dotenv/config"

export const getAllCategory = async (request, response) => {
    try {
        const category = await Category.findAll();
        response.json(category);
    } catch (error) {
        response.json({
            message: error.message
        })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const response = await Category.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!response) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const saveCategory = async(request, response) => {
    // Check if req.files is undefined or null
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).json({ msg: "No File Uploaded" });
    }

    const {name, status} = request.body;
    const file = request.files.file;

    // File details
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return response.status(422).json({ msg: "Invalid Image Extension" });
    }

    if (fileSize > 5000000) {
        return response.status(422).json({ msg: "Image must be less than 5MB" });
    }

    // Absolute path to save images
    const uploadDir = path.join(process.cwd(), 'public/categoryImages/');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const url = `${process.env.ORIGIN}/categoryImages/${fileName}`;

    file.mv(path.join(uploadDir, fileName), async (err) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ msg: "File Upload Error" });
        }

        try {
            await Category.create({
                name,
                image: fileName,
                url,
                status
            });

            return response.status(201).json({ msg: "Category Created Successfully" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "Database Error" });
        }
    });
}