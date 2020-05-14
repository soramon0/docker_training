const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.status(200).json({"message": "hi there"})
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`\t-Listening on port ${PORT}`)
})