/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Load variables from `.env` as soon as possible
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const R = require('ramda');
const snipcart_MDtoJSON = require('./src/helpers/snipcart_MDtoJSON_file');
const snipcart_sanityToJSON = require('./src/helpers/snipcart_sanityToJSON.js');
const dumpMdsToSanityFile =
  process.env.DUMP_MDToSanity === 'TRUE'
    ? require('./src/helpers/dumpmdtoSanityFile')
    : null;

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.type === 'MarkdownRemark') {
    if (node.fileAbsolutePath.includes('/collections/productCats/')) {
      // if a productCategory
      actions.createNodeField({ node, name: 'type', value: `productCats` });
      actions.createNodeField({
        node,
        name: 'slug',
        value: `/category/${slugify(node.frontmatter.title)}`,
      });
      actions.createNodeField({
        node,
        name: 'catName',
        value: node.frontmatter.title,
      });
      actions.createNodeField({
        node,
        name: 'disabled',
        value: node.frontmatter.disabled,
      });
    } else if (node.fileAbsolutePath.includes('collections/productRange')) {
      // if a productRange
      actions.createNodeField({ node, name: 'type', value: `productRange` });
      actions.createNodeField({
        node,
        name: 'slug',
        value: `/collections/${slugify(node.frontmatter.title)}`,
      });
    } else if (node.fileAbsolutePath.includes('collections/product/')) {
      // if a product
      if (node.frontmatter.Category === 'Lounges and Sofas') {
        // redirect to ensure havnen't broken old links when we took lounges out of living catigory
        actions.createRedirect({
          fromPath: `/category/Living/${slugify(node.frontmatter.title)}`,
          isPermanent: true,
          toPath: `/category/${slugify(node.frontmatter.Category)}/${slugify(
            node.frontmatter.title
          )}`,
          force: true,
          redirectInBrowser: true,
        });
      }
      actions.createNodeField({
        node,
        name: 'slug',
        value: `/category/${slugify(node.frontmatter.Category)}/${slugify(
          node.frontmatter.title
        )}`,
      });
      actions.createNodeField({ node, name: 'type', value: `product` });
      actions.createNodeField({
        node,
        name: 'productName',
        value: `${slugify(node.frontmatter.title)}`,
      });
      actions.createNodeField({
        node,
        name: 'category',
        value: node.frontmatter.Category,
      });
      actions.createNodeField({
        node,
        name: 'range',
        value: node.frontmatter.range,
      });
      actions.createNodeField({
        node,
        name: 'disabled',
        value: node.frontmatter.disabled,
      });
    }
  } else if (node.internal.type === 'gatsby-source-filesystem') {
    if (node.fileAbsolutePath.includes('/images/uploads')) {
      // do something here
    }
  }
};

const queries = {
  sanityCategory: require('./pageGenerator/sanity_product_category').query,
  sanityProduct: require('./pageGenerator/sanity_product').query,
  productCategory: require('./pageGenerator/md_product_category').query,
  productRange: require('./pageGenerator/md_product_range').query,
  product: require('./pageGenerator/md_products').query,
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  // run query
  const querySanityCategory = graphql(queries.sanityCategory);
  const querySanityProduct = graphql(queries.sanityProduct);
  const queryProductCategory = graphql(queries.productCategory);
  const queryProductRange = graphql(queries.productRange);
  const queryProduct = graphql(queries.product);

  // page generator functions
  const querySanityCategoryPage = result => {
    result.data.allSanityCategory.edges.forEach(({ node }) => {
      if (node.slug && node.slug.current) {
        const route = `/sanity/category/${node.slug.current}`;
        createPage({
          path: route.toLowerCase(),
          component: path.resolve('./src/templates/category-sanity.js'),
          context: {
            catigoryID: node._id,
            pageNum: 1,
            productsPerPage: 60,
          },
        });
        createRedirect({
          fromPath: route,
          isPermanent: true,
          toPath: route.toLowerCase(),
          force: true,
          redirectInBrowser: true,
        });
      } else {
        console.error('no slug for Category Page', node);
      }
    });
  };
  const querySanityProductPage = result => {
    result.data.allSanityProduct.edges.forEach(({ node }) => {
      if (node.slug && node.slug.current) {
        // product has slug
        if (node.category && node.category.slug && node.category.slug.current) {
          // has a valid category with a slug
          const routes = [
            `/sanity/category/${node.category.slug.current}/${node.slug.current}`,
          ];
          if (routes[0] !== routes[0].toLowerCase()) {
            routes.push(routes[0].toLowerCase());
          }
          routes.forEach(route => {
            createPage({
              path: route,
              component: path.resolve('./src/templates/product-sanity.js'),
              context: {
                productID: node._id,
              },
            });
          });
        }
      }
    });
  };
  const queryToCategoryPage = result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/category-route.js`),
        context: {
          slug: node.fields.slug,
          catName: node.frontmatter.title,
          images: node.frontmatter.images,
          disabled: node.fields.disabled,
        },
      });
    });
  };
  const queryToRangePage = result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/range-route.js`),
        context: {
          slug: node.fields.slug,
        },
      });
    });
  };

  const queryToProductPages = result => {
    const nodeToImageList = R.compose(
      R.lift(
        R.compose(
          R.last,
          R.split('/')
        )
      ),
      R.pathOr([], ['frontmatter', 'images'])
    );

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      // create main page from category
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/product-route.js`),
        context: {
          productName: slugify(node.frontmatter.title),
          range: node.frontmatter.range,
          images: nodeToImageList(node),
        },
      });
    });
  };

  // Do work in promise
  // // querySanityCategoryPage querySanityCategory
  const sanityProductPage = querySanityProduct.then(querySanityProductPage);
  const sanityCategoryPage = querySanityCategory.then(querySanityCategoryPage);
  const productCategoriesPages = queryProductCategory.then(queryToCategoryPage);
  const productRangePages = queryProductRange.then(queryToRangePage);

  // product and category pages
  const productPages = queryProduct.then(queryToProductPages);
  const categoryPages = Promise.all([
    querySanityProduct,
    querySanityCategory,
  ]).then(values => {
    console.log('values is', values);
    const [ProductsResults, CategoryResults] = values;
    CategoryResults.data.allSanityCategory.edges.forEach(({ node }) => {
      if (node.slug && node.slug.current) {
        const route = `/sanity/category/${node.slug.current}`;
        const productsPerPage = 90;
        const productsRelivant = ProductsResults.data.allSanityProduct.edges.filter(
          product => product.node.category._id === node._id
        );
        const numberOfPages = Math.ceil(
          productsRelivant.length / productsPerPage
        );
        // create default page
        createPage({
          path: route.toLowerCase(),
          component: path.resolve('./src/templates/category-sanity.js'),
          context: {
            categoryID: node._id,
            productsPerPage,
            pageNum: 1,
            skip: 0,
            totalPages: numberOfPages,
            totalProducts: productsRelivant.length,
          },
        });
        // create extra pages
        Array.from({ length: numberOfPages }).forEach((_, i) => {
          createPage({
            path: `${route.toLowerCase()}/page-${i + 1}`,
            component: path.resolve('./src/templates/category-sanity.js'),
            context: {
              categoryID: node._id,
              productsPerPage,
              pageNum: i + 1,
              skip: productsPerPage * i,
              totalPages: numberOfPages,
              totalProducts: productsRelivant.length,
            },
          });
        });
      }
    });
  });
  const writeSanityDumpFile = dumpMdsToSanityFile
    ? new Promise((resolve, reject) => {
        queryProduct.then(result => {
          const { productArrayToSanityDump } = dumpMdsToSanityFile;
          const products = result.data.allMarkdownRemark.edges.map(
            ({ node }) => ({
              name: node.frontmatter.title,
              slug: node.fields.slug,
              category: node.frontmatter.Category,
              range: node.frontmatter.range,
              variants: node.frontmatter.variants.map(variant => ({
                variantName: variant.variantName,
                price: variant.price,
                disabled: variant.disabled,
              })),
              disabled: node.frontmatter.disabled,
            })
          );
          if (process.env.NODE_ENV === 'development') {
            fs.writeFile(
              './../dumpFile.txt',
              productArrayToSanityDump(products),
              er => (er ? reject(er) : resolve(er))
            );
          } else {
            resolve();
          }
        });
      })
    : null;
  const writesnipcart_sanitytoJSON = new Promise((resolve, reject) => {
    querySanityProduct.then(result => {
      const snipcartObject = snipcart_sanityToJSON.snipcartJson(result);
      const JSONObject = JSON.stringify(snipcartObject);
      if (process.env.NODE_ENV === 'development') {
        console.log('snipcart.json not created in development');
        resolve();
      } else {
        fs.writeFile('./static/snipcart.json', JSONObject, er =>
          er ? reject(er) : resolve(er)
        );
      }
    });
  });
  const writesnipcart_MDtoJSON = new Promise((resolve, reject) => {
    queryProduct.then(result => {
      const snipcartObject = snipcart_MDtoJSON.snipcartJson(result);
      const JSONObject = JSON.stringify(snipcartObject);
      if (process.env.NODE_ENV === 'development') {
        console.log('snipcart_MD.json not created as in development');
        resolve();
      } else {
        fs.writeFile('./static/snipcart_md.json', JSONObject, er =>
          er ? reject(er) : resolve(er)
        );
      }
    });
  });

  const allPromisses = [
    productCategoriesPages,
    productRangePages,
    productPages,
    categoryPages,
    writesnipcart_MDtoJSON,
    sanityCategoryPage,
    sanityProductPage,
  ];
  if (writeSanityDumpFile) {
    allPromisses.push(writeSanityDumpFile);
  }
  return Promise.all(allPromisses);
};
