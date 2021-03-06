import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

import Logo from '../images/slimLogo.svg';
import CategoriesAll from '../components/CategoriesAll';
import DiscountedProducts from '../components/DiscountedProducts';

const IndexPage = () => (
  <Layout showHero>
    <SEO
      title="Home"
      keywords={[
        `Quality Furniture`,
        `Mobility Products`,
        `kempsey`,
        `port macquarie`,
        `macksville`,
      ]}
    />
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="mx-auto w-full">
        <img src={Logo} alt="" />
      </div>
      <div className="my-8 mx-auto text-center text-xl w-full">
        <p className="mb-16">
          Highest Quality, Lowest Prices,{' '}
          {
            <Link
              className="font-bold hover:text-cream-600 underline"
              to="/payment"
            >
              Flexible Payments
            </Link>
          }{' '}
          <br />
          <small>
            The widest range of Furniture, Mattresses and Mobility Solutions
            within the Macleay Valley.
          </small>
        </p>
      </div>
      {/*
        <div className="mb-8 mx-auto text-lg">
          <div className="flex flex-wrap -mx-2 mb-6">
            <div className="flex-1 mb-6 md:mb-0 px-2 w-full md:w-1/2">
              <div className="border border-cream-200 flex flex-col items-center bg-cream-100 p-4 rounded-lg shadow text-cream-700">
                <h3 className="font-bold text-2xl">
                  Massive floorstock Promotion
                </h3>
                <hr className="bg-cream-300 mt-1" />
                <p className="mb-2">
                  10% discount of floor stocked product's <br />
                  <small>*orders over $1000 for August 2019 Only</small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
      */}
      <hr className="bg-gray-200" />
      <div className="mb-4 mx-auto w-full">
        <h2 className="font-bold mb-4 text-2xl text-maroon-600">Latest Specials</h2>
        <DiscountedProducts />
      </div>
      <div className="mb-4 mx-auto w-full">
        <h2 className="font-bold mb-4 text-2xl text-maroon-600">Our Full Range</h2>
        <CategoriesAll />
      </div>
    </div>
  </Layout>
);

export default IndexPage;
