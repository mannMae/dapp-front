import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { Link } from "react-router-dom";

const Layout: FC = ({ children }) => {
  return (
    <Stack h="100vh">
      <Flex bg="purple.200" p={4} justifyContent="space-around" align="center">
        <Box>
          <Text fontWeight="bold">AnimalToken</Text>
        </Box>
        <Link to="/">
          <Button size="sm">Main</Button>
        </Link>
        <Link to="/my-animal">
          <Button size="sm">My Animal</Button>
        </Link>
        <Link to="/sale-animal">
          <Button size="sm">Sale Animal</Button>
        </Link>
      </Flex>
      <Flex
        direction="column"
        h="full"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
