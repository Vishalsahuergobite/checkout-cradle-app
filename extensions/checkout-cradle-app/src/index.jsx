
import React, { useEffect, useState } from "react";
import {
  render,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useExtensionApi,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App1 />);

// const PRODUCT_VARIANTS_DATA1 = [
//   {
//     id: "gid://shopify/ProductVariant/40439056433199",
//     img: "https://assets.cradlewise.com/images/products/fitted-sheet/Cradlewise-Crib-Fitted-Sheet-6-rotated.jpeg",
//     title: "Cradlewise Fitted sheet",
//     price: "$24.99",
//   },
  
//   {
//     id: "gid://shopify/ProductVariant/40614492209199",
//     img: "https://assets.cradlewise.com/images/products/mattress-cover/PXL_20220304_110704438.jpg",
//     title: "Cradlewise Mattress Cover",
//     price: "$45.00",
//   },
// ];

const PRODUCT_VARIANTS_DATA1 = [
  {
    id: "gid://shopify/ProductVariant/44574727471380",
    img: "https://assets.cradlewise.com/images/products/fitted-sheet/Cradlewise-Crib-Fitted-Sheet-6-rotated.jpeg",
    title: "Cradlewise Fitted sheet",
    price: "$24.99",
  },

  {
    id: "gid://shopify/ProductVariant/44574399398164",
    img: "https://assets.cradlewise.com/images/products/mattress-cover/PXL_20220304_110704438.jpg",
    title: "Cradlewise Mattress Cover",
    price: "$45.00",
  },

];


function App1() {
  const cartLine = useCartLines()

  const { i18n } = useExtensionApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding1, setAdding1] = useState(false);
  const [adding2, setAdding2] = useState(false);
  const [showError, setShowError] = useState(false);
  const [ids1, setIds1] = useState("");
  const [ids2, setIds2] = useState("");

  // for live 
  // useEffect(() => {
  //   if (cartLine.length > 1) {
  //     cartLine.map((ele, i) => {
  //       if (ele.merchandise.id == 'gid://shopify/ProductVariant/40439056433199') {
  //         setIds1(ele.merchandise.id)
  //       } 

  //       if (ele.merchandise.id == 'gid://shopify/ProductVariant/40614492209199') {
  //         setIds2(ele.merchandise.id)
  //       }
  //     })
  //   }
  // }, [cartLine])



  useEffect(() => {
    if (cartLine.length > 1) {
      cartLine.map((ele, i) => {
        if (ele.merchandise.id == 'gid://shopify/ProductVariant/44574727471380') {
          setIds1(ele.merchandise.id)
        }

        if (ele.merchandise.id == 'gid://shopify/ProductVariant/44574399398164') {
          setIds2(ele.merchandise.id)
        }
      })
    }
  }, [cartLine])

  // On initial load, fetch the product variants
  useEffect(() => {
    // Set the loading state to show some UI if you're waiting
    setLoading(true);
    // If you're making a network request, then replace the following code with the HTTP call
    // If you don't need to make a network request, then you can remove this `useEffect`
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(PRODUCT_VARIANTS_DATA1);
      }, 800);
    })
      .then((result) => {
        // Set the "products" array so that you can reference the array items
        setProducts(result);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // If an offer is added and an error occurs, then show some error feedback using a banner
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Access the current cart lines and subscribe to changes
  const lines = useCartLines();

  // Show a loading UI if you're waiting for product variant data
  // Use Skeleton components to keep placement from shifting when content loads
  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Divider />
        <Heading level={2}>You might also like</Heading>
        {PRODUCT_VARIANTS_DATA1.map((e) =>
          <BlockStack spacing="loose" key={e.id}>
            <InlineLayout
              spacing="base"
              columns={[64, "fill", "auto"]}
              blockAlignment="center"
            >
              <SkeletonImage aspectRatio={1} />
              <BlockStack spacing="none">
                <SkeletonText inlineSize="large" />
                <SkeletonText inlineSize="small" />
              </BlockStack>
              <Button kind="secondary" disabled={true}>
                Add
              </Button>
            </InlineLayout>
          </BlockStack>)}
      </BlockStack>
    );
  }
  // If product variants can't be loaded, then show nothing
  if (!loading && products.length === 0) {
    return null;
  }

  // Filter out any product variants on offer that are already current cart lines
  const productsOnOffer = products.filter(
    (product) => !lines.map((item) => item.merchandise.id).includes(product.id)
  );
  // Choose the first available product variant on offer or display the default fallback product variant
  const { id, img, title, price } = productsOnOffer[0] || products[0];
  // Localize the currency for international merchants and customers
  const renderPrice = i18n.formatCurrency(price);

  return (
    !(PRODUCT_VARIANTS_DATA1[0].id == ids1 && PRODUCT_VARIANTS_DATA1[1].id == ids2) && 
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You may also like</Heading>

      {
         PRODUCT_VARIANTS_DATA1[0].id !== ids1 && 
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <Image
              border="base"
              borderWidth="base"
              borderRadius="loose"
              source={PRODUCT_VARIANTS_DATA1[0].img}
              description={PRODUCT_VARIANTS_DATA1[0].title}
              aspectRatio={1}
            />
            <BlockStack spacing="none">
              <Text size="medium" emphasis="strong">
                {PRODUCT_VARIANTS_DATA1[0].title}
              </Text>
              <Text appearance="subdued">{PRODUCT_VARIANTS_DATA1[0].price} 
              {/* <Icon source="discount"/>1<Icon source="discount"/> */}
              </Text>
            </BlockStack>

            {/* button for remove product  */}
              <Button
                kind="secondary"
                loading={adding1}
                accessibilityLabel={`Add ${PRODUCT_VARIANTS_DATA1[0].title} to cart`}
                onPress={async () => {
                  setAdding1(true);
                  const result = await applyCartLinesChange({
                    type: "addCartLine",
                    merchandiseId: PRODUCT_VARIANTS_DATA1[0].id,
                    quantity: 1,
                  });
                  setAdding1(false);
                  if (result.type === "error") {
                    setShowError(true);
                    console.error(result.message);
                  }
                }}
              >
                Add
              </Button>
          </InlineLayout>
        </BlockStack>
      }

      {
        PRODUCT_VARIANTS_DATA1[1].id !== ids2 && 
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <Image
              border="base"
              borderWidth="base"
              borderRadius="loose"
              source={PRODUCT_VARIANTS_DATA1[1].img}
              description={PRODUCT_VARIANTS_DATA1[1].title}
              aspectRatio={1}
            />
            <BlockStack spacing="none">
              <Text size="medium" emphasis="strong">
                {PRODUCT_VARIANTS_DATA1[1].title}
              </Text>
              <Text appearance="subdued">{PRODUCT_VARIANTS_DATA1[1].price}</Text>
            </BlockStack>


            {<Button
                kind="secondary"
                loading={adding2}
                accessibilityLabel={`Add ${PRODUCT_VARIANTS_DATA1[1].title} to cart`}
                onPress={async () => {
                  setAdding2(true);
                  const result = await applyCartLinesChange({
                    type: "addCartLine",
                    merchandiseId: PRODUCT_VARIANTS_DATA1[1].id,
                    quantity: 1,
                  });
                  setAdding2(false);
                  if (result.type === "error") {
                    setShowError(true);
                    console.error(result.message);
                  }
                }}
              >
                Add
              </Button>}
          </InlineLayout>
        </BlockStack>}

      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
    </BlockStack>
  );
}
