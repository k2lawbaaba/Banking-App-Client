import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Homepages";
import Dashboard from "./Components/Dashboard";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink} from '@apollo/client';

// const httpLink = createHttpLink({
//   // uri: "https://banking-api-mcxq.onrender.com/graphql",
//   uri: "http://localhost:4004/graphql",
// });

const client = new ApolloClient({
  uri: "http://localhost:4004/graphql",

  // uri: "https://banking-api-mcxq.onrender.com/graphql",
  cache: new InMemoryCache(),
  credentials:"include",

});
function App() {
  return (
  <ApolloProvider client={client}>
    <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Dashboard/" element={<Dashboard />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
