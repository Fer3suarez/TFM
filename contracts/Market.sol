// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarket is ERC721URIStorage {
  using Counters for Counters.Counter;
  /* Contadores de Id y de los NFTs vendidos usando Counters */
  Counters.Counter private _nftIds;
  Counters.Counter private _nftsVendidos;

  address payable owner;
  uint256 precioGas = 0.025 ether;

  constructor() ERC721("TFM", "TFM") {
    owner = payable(msg.sender);
  }

  /* Estructura de un NFT del mercado */
  struct MarketNFT {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 precio;
    bool vendido;
    address payable creador;
  }

  /* Mapa de los NFT que estén en el mercado */
  mapping(uint256 => MarketNFT) private marketNFTs;

  /* Evento cuando ponemos un NFT al mercado */
  event CrearMarketNFT (
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 precio,
    bool vendido,
    address creador
  );

  /* Devolvemos el precio del gas */
  function getPrecioGas() public view returns (uint256) {
    return precioGas;
  }

  function createToken(string memory tokenURI, uint256 precio) public payable returns (uint) {
    _nftIds.increment();
    uint256 newTokenId = _nftIds.current();

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    ponerNFTMercado(newTokenId, precio);
    return newTokenId;
  }
  
  /* Función que pone un NFT en el mercado */
  function ponerNFTMercado(uint256 tokenId, uint256 precio) private {
    require(precio > 0, "El precio no puede ser 0 o negativo"); //Restricción de precios
    require(msg.value == precioGas, "El precio debe ser mayor que el precio del gas"); //Restricción de precios

    // Guardamos el nuevo NFT en el mapa del mercado
    marketNFTs[tokenId] =  MarketNFT(
      tokenId,
      payable(msg.sender), // Vendedor es el que pone a vender el NFT
      payable(address(this)), 
      precio,
      false, // false porque si lo ponemos a la venta, no está vendido
      payable(msg.sender)
    );

    _transfer(msg.sender, address(this), tokenId); // Transfer(from, to, id)

    /* Emitimos el evento con los datos del NFT que guardamos en el mercado*/
    emit CrearMarketNFT(
      tokenId,
      msg.sender,
      address(this),
      precio,
      false,
      msg.sender
    );
  }

  function resellToken(uint256 tokenId, uint256 precio) public payable {
      require(marketNFTs[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == precioGas, "Price must be equal to listing price");
      marketNFTs[tokenId].vendido = false;
      marketNFTs[tokenId].precio = precio;
      marketNFTs[tokenId].seller = payable(msg.sender);
      marketNFTs[tokenId].owner = payable(address(this));
      _nftsVendidos.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

  /* Función para comprar un NFT, realizando los cambios en los campos owner y vendido */
  function compraNFT(uint256 tokenId) public payable {
    uint precio = marketNFTs[tokenId].precio;
    address seller = marketNFTs[tokenId].seller;

    require(msg.value == precio, "Please submit the asking price in order to complete the purchase");

    marketNFTs[tokenId].owner = payable(msg.sender);
    marketNFTs[tokenId].vendido = true;
    marketNFTs[tokenId].seller = payable(address(0));
    _nftsVendidos.increment();
    _transfer(address(this), msg.sender, tokenId);
    payable(owner).transfer(precioGas);
    payable(seller).transfer(msg.value);
  }

  /* Función que devuelve todos los NFTs que no han sido vendidos */
  function getNFTsMercado() public view returns (MarketNFT[] memory) {
    uint numeroNFTs = _nftIds.current(); // El ID actual, es el número de NFTs 
    uint NFTsNoVendidos = _nftIds.current() - _nftsVendidos.current();
    uint currentIndex = 0;

    MarketNFT[] memory nfts = new MarketNFT[](NFTsNoVendidos); // Creamos un array de NFTs no vendidos

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].owner == address(this)) { // Seleccionamos los NFTs que no tienen owner
        uint currentId = i + 1;
        MarketNFT storage currentNFT = marketNFTs[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }

  /* Función que devuelve todos los NFTs que un usuario ha comprado */
  function getMisNFTs() public view returns (MarketNFT[] memory) {
    uint numeroNFTs = _nftIds.current(); // El ID actual, es el número de NFTs 
    uint nftCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].owner == msg.sender) {
        nftCount += 1;
      }
    }

    MarketNFT[] memory nfts = new MarketNFT[](nftCount); // Creamos un array de los NFTs de un usuario 

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].owner == msg.sender) { // Seleccionamos los NFTs del usuario que él es el owner
        uint currentId = i + 1;
        MarketNFT storage currentNFT = marketNFTs[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }

  /* Función que devuelve todos los NFTs que un usuario ha creado (subido a la APP) */
  function getMisNFTsCreados() public view returns (MarketNFT[] memory) {
    uint numeroNFTs = _nftIds.current(); // El ID actual, es el número de NFTs 
    uint nftCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].creador == msg.sender) {
        nftCount += 1;
      }
    }

    MarketNFT[] memory nfts = new MarketNFT[](nftCount); // Creamos un array de los NFTs de un usuario 

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].creador == msg.sender) { // Seleccionamos los NFTs del usuario que él es el seller
        uint currentId = i + 1;
        MarketNFT storage currentNFT = marketNFTs[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }

  /* Función que devuelve un NFT introduciendo su id */
  function getNFTPorId(uint256 nftId) public view returns(MarketNFT memory) {
      return marketNFTs[nftId];
  }

  receive() external payable {
  }

  fallback() external payable {
  }
}