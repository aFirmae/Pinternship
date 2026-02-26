import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

interface Product {
	id: string;
	name: string;
	price: number;
	inStock: boolean;
}

let products: Product[] = [
	{ id: "1", name: "Bananas", price: 1.5, inStock: true },
	{ id: "2", name: "Apples", price: 2.0, inStock: false },
];

// GET all products
app.get("/products", (req: Request, res: Response) => {
	res.status(200).json(products);
});

// GET product by ID
app.get("/products/:id", (req: Request, res: Response) => {
	const product = products.find(p => p.id === req.params.id);
	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}
	res.status(200).json(product);
});

// POST new product
app.post("/products", (req: Request, res: Response) => {
	const { name, price, inStock } = req.body;
	if (!name || price === undefined || inStock === undefined) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	const newProduct: Product = {
		id: (products.length + 1).toString(),
		name,
		price,
		inStock,
	};
	products.push(newProduct);
	res.status(201).json(newProduct);
});

// PUT update product
app.put("/products/:id", (req: Request, res: Response) => {
	const productIndex = products.findIndex(p => p.id === req.params.id);
	if (productIndex === -1) {
		return res.status(404).json({ error: "Product not found" });
	}
	const { name, price, inStock } = req.body;
	if (!name || price === undefined || inStock === undefined) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	products[productIndex] = { id: req.params.id as string, name, price, inStock };
	res.status(200).json(products[productIndex]);
});

// PATCH update product price
app.patch("/products/:id/price", (req: Request, res: Response) => {
	const product = products.find(p => p.id === req.params.id);
	const { price } = req.body;
	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}
	if (typeof price !== "number" || price < 0) {
		return res.status(400).json({ error: "Invalid price" });
	}
	product.price = price;
	res.status(200).json(product);
});

// PATCH update product inStock status
app.patch("/products/:id/stock", (req: Request, res: Response) => {
	const product = products.find(p => p.id === req.params.id);
	const { inStock } = req.body;
	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}
	if (typeof inStock !== "boolean") {
		return res.status(400).json({ error: "Invalid inStock status" });
	}
	product.inStock = inStock;
	res.status(200).json(product);
});

// DELETE product
app.delete("/products/:id", (req: Request, res: Response) => {
	const productIndex = products.findIndex(p => p.id === req.params.id);
	if (productIndex === -1) {
		return res.status(404).json({ error: "Product not found" });
	}
	products.splice(productIndex, 1);
	res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
