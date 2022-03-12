// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _nftIds;
    address contractAddress;

    constructor(address galleryAddress) ERC721("TFM", "TFM") {
        contractAddress = galleryAddress;
    }

    struct nftItem {
        uint256 tokenId;
        address  owner;
        string tokenUri;
    }

    mapping(uint256 => nftItem) private nftMarket;

    function createToken(string memory tokenURI) public returns (uint) {
        _nftIds.increment();
        uint256 newItemId = _nftIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        nftMarket[newItemId] = nftItem(newItemId, msg.sender, tokenURI);

        return newItemId;
    }

    /* Función que devuelve todos los NFTs que un usuario ha comprado */
  function getMisNFTs() public view returns (nftItem[] memory) {
    uint numeroNFTs = _nftIds.current(); // El ID actual, es el número de NFTs 
    uint nftCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < numeroNFTs; i++) {
      if (nftMarket[i + 1].owner == msg.sender) {
        nftCount += 1;
      }
    }

    nftItem[] memory nfts = new nftItem[](nftCount); // Creamos un array de los NFTs de un usuario 

    for (uint i = 0; i < numeroNFTs; i++) {
      if (nftMarket[i + 1].owner == msg.sender) { // Seleccionamos los NFTs del usuario que él es el owner
        uint currentId = i + 1;
        nftItem storage currentNFT = nftMarket[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }
}