// average rating for each genre in 2024 and with more than 10,000 total views
db.watchHistory.aggregate([
    { $match: { year: 2024 } },
    {
        $group: {
            _id: "$genre",
            avgRating: { $avg: "$rating" },
            totalViews: { $sum: "$views" }
        }
    },
    { $match: { totalViews: { $gt: 10000 } } },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            avgRating: { $round: ["$avgRating", 1] },
            totalViews: 1
        }
    }
])
