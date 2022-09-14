import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";
import {
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
} from "../constracts/web3Config";

interface MyAnimalProps {
  account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);
  useEffect(() => {
    console.log(animalCardArray);
  }, [animalCardArray]);

  const getAnimalTokens = async () => {
    console.log(account);
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();

      if (balanceLength === "0") return;

      const tempAnimalCardArray: IMyAnimalCard[] = [];

      const response = await mintAnimalTokenContract.methods
        .getAnimalTokens(account)
        .call();

      response.map((v: IMyAnimalCard) => {
        tempAnimalCardArray.push({
          animalTokenId: v.animalTokenId,
          animalType: v.animalType,
          animalPrice: v.animalPrice,
        });
      });

      setAnimalCardArray(tempAnimalCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .isApprovedForAll(account, saleAnimalTokenAddress)
        .call();

      if (response) {
        setSaleStatus(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;
      const response = await mintAnimalTokenContract.methods
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .send({ from: account });

      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    getIsApprovedForAll();
    getAnimalTokens();
  }, [account]);

  return (
    <>
      <Flex alignItems="center">
        <Text display="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
        </Text>
        <Button
          size="x5"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {animalCardArray
          ? animalCardArray.map((v, i) => {
              return (
                <MyAnimalCard
                  key={i}
                  animalPrice={v.animalPrice}
                  animalTokenId={v.animalTokenId}
                  animalType={v.animalType}
                  saleStatus={saleStatus}
                  account={account}
                />
              );
            })
          : "Loading..."}
      </Grid>
    </>
  );
};

export default MyAnimal;
