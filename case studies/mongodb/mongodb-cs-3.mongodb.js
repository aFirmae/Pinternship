// Refund a payment: add refund amount back to sender, subtract from recipient, update original transaction status to "refunded", log a new refund record.

{
    const session = db.getMongo().startSession();
    session.startTransaction();

    try {
        // add refund amount back to the original sender (Alice)
        db.users.updateOne(
            { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e1") },
            { $inc: { balance: 100 } },
            { session }
        );

        // subtract refund amount from the recipient (Bob)
        db.users.updateOne(
            { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e2") },
            { $inc: { balance: -100 } },
            { session }
        );

        // update the original transaction status to "refunded"
        db.transactions.updateOne(
            { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e3") },
            { $set: { status: "refunded" } },
            { session }
        );

        // log record
        db.transactions.insertOne(
            {
                from: ObjectId("665f4d7e8b3e6c1e24a7b3e2"),
                to: ObjectId("665f4d7e8b3e6c1e24a7b3e1"),
                amount: 100,
                date: new Date(),
                status: "refund"
            },
            { session }
        );

        session.commitTransaction();
    } catch (e) {
        session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }
}
