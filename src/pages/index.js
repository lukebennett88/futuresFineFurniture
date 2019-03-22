import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RangeDisplay from '../components/range'

import RedHeart from '../components/redHeart'
import { Card, Colors } from "@blueprintjs/core";
import Logo from "../components/logo";


const ListofLove = ({ love, children, rot="0deg" }) => (
  <Card elevation={5}
  style={{ padding: '10px', listStyle: `none`, transform:rot, }}
  className="bp3-dark"
  >
    <h4 style={{ marginBottom: '0.1rem', textAlign:'center' }}>We <RedHeart /> {love}</h4>
    <br/>
    <div style={{ transform: 'translateX(10px)' }}>
      {children}
    </div>
  </Card>
)


const IndexPage = () => (
  <Layout showHero>
    <SEO title="Home" keywords={[
      `Quality Furniture`,
      `Mobility Products`,
      `kempsey`,
      'port macquarie',
      'macksville'
    ]} />
    <div style={{
      padding: '15px'
    }}>
    <Logo />
      <p 
        style={{
          fontSize:'1.01rem',
          textAlign:'center',
        }}
      >
        The widest range of new and end of line furniture and Mobility Supplys.<br/>
        Everything you need to turn your space into a home.<br/>
      </p>
      <div style={{ 
      display:'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: '15px',
      maxWidth: "40rem",
      fontSize: '1.1rem',
      margin: '1em auto'
    }} >
      <ListofLove love="Accessibillity" rot="15deg">
        <ul style={{listStyle:'none', textAlign:'center', margin:'0 0'}}>
          <li>Lowest Prices</li>
          <li><Link to="/payment">Flexible payments</Link></li>
          <li><span style={{fontsize:'1.5rem',color:'red'}}>Free Delivery</span>*</li>
        </ul>
        * within Macleay Vally - March 2019
      </ListofLove> 
      <ListofLove love="Quality">
        <ul style={{listStyle:'none', textAlign:'center', margin:'0 0'}}>
          <li>Highest Quality</li>
          <li>Best Functionality</li>
          <li>Beauty to Inspire</li>
        </ul>
      </ListofLove>
    </div>
    </div>
    
    <div>
      <h2>Our Range</h2>
      <RangeDisplay.Categories/>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

    </div>
  </Layout>
)

export default IndexPage
