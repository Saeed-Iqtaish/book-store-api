import express from "express"
import pgclient from "../db.js";

const router = express.Router();


//get all books
router.get("/", async (req, res) => {
    try {

        const books = await pgclient.query("SELECT * from books")
        res.json(books.rows);
    } catch (error) {
        console.log(error);

    }

});

//get book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await pgclient.query("SELECT * from books WHERE id = $1", [req.params.id]);
        if (book.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book.rows[0]);
    } catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

//create book
router.post("/", async (req, res) => {
    try {
        console.log("Request body:", req.body); 

        const { title, author, year } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const result = await pgclient.query(
            "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *",
            [title, author || null, year || null]  // Removed the undefined 'id' parameter
        );

        console.log("Query result:", result.rows);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

router.put("/:id", async(req,res)=>{
    try {
        console.log("Request body:", req.body);

        const { title, author, year } = req.body;
        const book = await pgclient.query
        ("UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *",
            [title, author, year, req.params.id]);

        if (book.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book.rows[0]);
    } catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

router.delete("/:id", async(req,res)=>{
    try {

        const book = await pgclient.query
        ("DELETE FROM books WHERE id = $1 RETURNING *", [req.params.id]);

        if (book.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({message: "Book deleted" , book: book.rows[0]});
    } catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});


export default router;