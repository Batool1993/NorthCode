import { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import { propertiesApi } from "../../api/PropertiesApi";
import { constant } from "lodash";
import numeral from "numeral";
import useMounted from "../../hooks/useMounted";



/* const [mounted, setMounted] = useState(false);
let [tenancies, setTenancies] = useState([]); */

/* const getData = useCallback(async () => {
  Storage.get(property.documentName,{
  level: 'public'})
  .then(data=>{return data})
  .then(data=> setFileNameS(data));
    try {
    const Data = await fetch('https://landlordfiles170913-dev.s3.amazonaws.com/public/AccurateData.json')
  .then(response => response.json())
  .then(data=>{ return data})
  if (mounted.current) {
     setList(Data);
      
  }} 
  catch (err) {
     console.error(err);
    
  }
}, [mounted]);

useEffect(() => {
  getData();
}, [getData]); */

/* const getTenancies = async () => {
  try {
    const data4 = await propertiesApi.getTenancies(property.id)
   
      setTenancies(data4);
      setMounted(true)
    
  } catch (err) {
    console.error(err);
  }
};
if(!mounted){
  getTenancies();
}

const price = tenancies.map((tenancy) => (tenancies.price))
  
const totalvalue  = tenancies.reduce((totalprice, {price}) => totalprice + {price},0); */

const TotalPortfolio = (props) => {
  let { property, onBack, onNext, ...other } = props;

  const [list, setList] = useState([]);
  const [properties, setProperties] = useState([]);
  const mounted = useMounted();

  let flatCurrent = "";
  let detachedCurrent = "";
  let semidetachedCurrent = "";
  let terracedCurrent = "";
  let allPrice = [];
  /*let currentPrice = allPrice.reduce((acc, val) => acc + val, 0);
  let rcurrentPrice = numeral(currentPrice).format(`0,0.00`);*/
  
  
  
  const getProperties = useCallback(async () => {
    try {
      const data = await propertiesApi.getProperties();
      if (mounted.current) {
        setProperties(data);
       
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const getData = useCallback(async () => {
    try {
      const Data = await fetch(
        "https://landlordfiles170913-dev.s3.amazonaws.com/public/AccurateData.json"
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      if (mounted.current) {
        setList(Data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getData();
    getProperties();
  }, [getData, getProperties]);

  // const price = tenancies.map((tenancy) => (numeral(tenancy.price).format(
  //   `${tenancy.currency}0,0.00`
  // )));
  // console.log(price);

  /*  const totalvalue = tenancies.reduce(
    (totalprice, tenancy) => totalprice + Number(tenancy.price),
    0
  );

  const totalcurrency = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(totalvalue); */

  return (
    <Box>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Total Portfolio size
          </Typography>
          <Grid item>
            <Grid>
              {properties.map((property) =>
                list.map((items) => (
                  <Grid item>
                    {(() => {
                      if (items.regionname === property.location) {
                        switch (property.propertyType) {
                          case "Detached":
                            return (
                              <Grid item>
                                <Typography
                                  color="textPrimary"
                                  variant="subtitle2"
                                >
                                  {(() => {
                                    if (
                                      items.detachedprice >=
                                      property.purchasePrice
                                    ) {detachedCurrent = 
                                      (
                                        (property.purchasePrice *
                                          (items.detached12mchange + 1)) /
                                          (items.detached1mchange + 1)
                                      );
                                      allPrice.push(detachedCurrent);

                                    
                                    }
                                    {detachedCurrent = ((
                                      property.purchasePrice *
                                        (1 -
                                          Math.abs(
                                            items.detachedprice -
                                              property.purchasePrice
                                          ) /
                                            property.purchasePrice)
                                    ))
                                    allPrice.push(detachedCurrent);
                                  }
                                })()}
                                </Typography>
                              </Grid>
                            );

                          case "Flat":
                            return (
                              <Grid item>
                                <Typography
                                  color="textPrimary"
                                  variant="subtitle2"
                                >
                                  {(() => {
                                    if (
                                      items.flatprice >= property.purchasePrice
                                    ) {flatCurrent = (
                                      (property.purchasePrice *
                                        (items.flat12mchange + 1)) /
                                        (items.flat1mchange + 1)
                                    );
                                    allPrice.push(flatCurrent);

                                    }

                                    {flatCurrent = (
                                      (property.purchasePrice *
                                        (items.flat1mchange + 1)) /
                                        (items.flat12mchange + 1)
                                    );
                                    allPrice.push(flatCurrent);
                              

                                 
                                  }
                                  })()}
                                </Typography>
                              </Grid>
                            );
                          case "Semi-Detached":
                            return (
                              <Grid item>
                                <Typography
                                  color="textPrimary"
                                  variant="subtitle2"
                                >
                                  {(() => {
                                    if (
                                      items.semidetachedprice >=
                                      property.purchasePrice
                                    ) {semidetachedCurrent = (1 * (
                                      (property.purchasePrice *
                                        (items.semidetached12mchange + 1)) /
                                        (items.semidetached1mchange + 1)
                                    ));
                                    allPrice.push(semidetachedCurrent);

                                
                                    }
                                    {semidetachedCurrent = (
                                      property.purchasePrice *
                                        (1 -
                                          Math.abs(
                                            items.semidetachedprice -
                                              property.purchasePrice
                                          ) /
                                            property.purchasePrice)
                                    )}
                                    allPrice.push(semidetachedCurrent);

                                  })()}
                                </Typography>
                              </Grid>
                            );

                          case "Terraced":
                            return (
                              <Grid item>
                                <Typography
                                  color="textPrimary"
                                  variant="subtitle2"
                                >
                                  {(() => {
                                    if (
                                      items.terracedprice >=
                                      property.purchasePrice
                                    ) {terracedCurrent = 
                                      (property.purchasePrice *
                                        (1 +
                                          Math.abs(
                                            items.terracedprice -
                                              property.purchasePrice
                                          ) /
                                            property.purchasePrice)
                                    );

                                    allPrice.push(terracedCurrent);
                                
                                    }

                                    {terracedCurrent = (
                                      property.purchasePrice *
                                        (1 -
                                          Math.abs(
                                            items.terracedprice -
                                              property.purchasePrice
                                          ) /
                                            property.purchasePrice)
                                    ) 

                                    allPrice.push(terracedCurrent);
                            
                                 
                                  }})()};
                                </Typography>
                              </Grid>
                            );

                          default:
                            return "";
                        }
                      }
                    })()}
                  </Grid>
                ))
              )}
            <Typography  color="textPrimary"
            variant="h3">
              £{numeral(allPrice.reduce((acc, val) => acc + val, 0)).format(`0,0.00`)}
            </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: green[600],
              height: 56,
              width: 56,
            }}
          > 
            <PeopleIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          pt: 2,
        }}
      >
        <ArrowUpwardIcon sx={{ color: green[900] }} />
        <Typography
          variant="body2"
          sx={{
            color: green[900],
            mr: 1,
          }}
        >
          3%
        </Typography>
        <Typography color="textSecondary" variant="caption">
          Since last month
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          pt: 2,
        }}
      >
        <ArrowUpwardIcon sx={{ color: green[900] }} />
        <Typography
          variant="body2"
          sx={{
            color: green[900],
            mr: 1,
          }}
        >
          16%
        </Typography>
        <Typography color="textSecondary" variant="caption">
          Since last year
        </Typography>
      </Box>
    </Box>
  );
};


export default TotalPortfolio;
