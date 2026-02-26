import createApp from "./app";

const PORT = 3000;

const app = createApp();

app.listen(PORT, () => {
    console.log(`Hospital system running on port ${PORT}`);
});
