import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import BuyButton from '../components/snipcart'
import SEO from '../components/seo'
import * as R from 'ramda'

//const average = R.converge(R.divide, [R.sum, R.length])
const formatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

const details = R.compose(
  dangHtml => <div style={{flex:'0 1 auto',order:2,maxWidth:'250px'}} >
    <p dangerouslySetInnerHTML={{__html:dangHtml}}/>
  </div>,
  R.pathOr('',['markdownRemark','html']),
)

const ImageComponent = input => input ? <img alt="product" src={input} /> : null

const images = R.compose(
  R.lift(R.compose(
    R.pathOr(null, ['node', 'childImageSharp', 'fixed', 'src']),
  )),
  R.pathOr([], ['allFile', 'edges']),
)

//const getSafePath = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

export default ({ data, location }) => {
  const { title, Category, range, variants } = data.markdownRemark.frontmatter
  return (
    <Layout>
      <SEO 
        title = {title} 
        keywords={[
          title,
          Category,
          'furniture',
          range,
          ... R.map(R.prop('varientName'))(variants)
        ]}
        image={R.compose(
          R.head,
          images
        )(data)}
      />
      <button className="snipcart-checkout">Click here to checkout</button>
      <div>
        <h1>{title}</h1>
        {
          Category && range
            ? `From the ${Category} Collection and the ${range} range`
            : Category
              ? `From the ${Category} Collection`
              : range
                ? `From the ${range} range`
                : ''
        }
        <div style={{margin:'15px', display:'flex',flexWrap:'wrap',flexDirection:'row',justifyContent:'center',alignItems:'center',alignContent:'center'}}>
          <div style={{flex:'0 1 auto',order:0}}>
            {
              R.compose(
                ImageComponent,
                images
              )(data)
            }
          </div>
          {
            details(data)
          }
        </div>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              variants.map(vari => (
                <tr key={vari.varientName}>
                  <td>{variants.length > 1 ? vari.varientName : `${title} ${vari.varientName? `- ${vari.varientName}` : ""}` }</td>
                  <td>{formatter.format(vari.price / 100)}
                  </td>
                  <td>
                    <BuyButton
                      name={`${title}_${vari.varientName}`}
                      id={`${title}_${vari.varientName}`}
                      image={null}
                      url={location.href}
                      price={vari.price}
                      description={null}
                    >
                      Add to Shopping Cart
                    </BuyButton>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

//markdownRemark(frontmatter: {title: {eq: $slug}}) {
export const query = graphql`
query($productName: String!, $images: [String])	{
  allFile(filter:{relativePath:{in: $images} sourceInstanceName:{eq:"contentImages"}}){
    edges{
      node{
        childImageSharp{fixed(width:400){src}}
      }
    }
  }
  markdownRemark(fields:{type: {eq:"product"} productName:{eq:$productName}}) {
    html
    frontmatter {
      title
      enabled
      Category
      range
      variants {
        price
        varientName
        properties {
          propertyType
          propertyValue
        }
      }
    }
    fields {
      type
      slug
      catName
      productName
      catigory
    }
  }
}
`
