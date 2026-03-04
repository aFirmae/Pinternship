// adding a new vegan dish
db.menu.insertOne({
    name: "Tofu Buddha Bowl",
    cuisine: "Asian",
    price: 9.50,
    tags: ["vegan", "gluten-free"],
    available: true
});

// all available vegan dishes under $12
db.menu.find(
    { available: true, tags: "vegan", price: { $lt: 12 } },
    { name: 1, price: 1, _id: 0 }
);

// update and add
db.menu.updateOne(
    { name: "Tofu Buddha Bowl" },
    {
        $set: { price: 10.00 },
        $push: { tags: "popular" }
    }
);

// delete
db.menu.deleteOne({
    name: "Old Special Soup"
});
