// gatsby-config.js
const axios = require("axios")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  try {
    // Fetch the sheet list from the server using the getSheetList function
    const response = await axios.get("http://localhost:8080/getSheetList")
    const itemList = response.data // Assuming the server responds with an array of items

    // Create dynamic pages for each item in the itemList
    itemList.forEach(item => {
      createPage({
        path: `/product-list/${item}`,
        component: require.resolve("./src/templates/product-list.js"),
        context: { item }, // Pass the item as a context to the template
      })
    })
  } catch (error) {
    console.error("Error fetching item list:", error)
  }
}
