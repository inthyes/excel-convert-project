// gatsby-node.js
const axios = require("axios")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  try {
    const response = await axios.get("http://localhost:8080/getSheetList")
    const itemList = response.data

    itemList.forEach(item => {
      console.log("gatsby-node:", item) // 확인을 위해 추가한 로그
      createPage({
        path: `/product-list/${item}`,
        component: require.resolve("./src/templates/product-list.js"),
        context: { item },
      })
    })
  } catch (error) {
    console.error("Error fetching item list:", error)
  }
}
