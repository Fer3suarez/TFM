// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  /* Contadores de Id y de los NFTs vendidos usando Counters */
  Counters.Counter private _nftIds;
  Counters.Counter private _nftsVendidos;

  address payable owner;
  uint256 precioGas = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  /* Estructura de un NFT del mercado */
  struct MarketNFT {
    uint256 nftId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 precio;
    bool vendido;
  }

  /* Mapa de los NFT que estén en el mercado */
  mapping(uint256 => MarketNFT) private marketNFTs;

  /* Evento cuando ponemos un NFT al mercado */
  event CrearMarketNFT (
    uint indexed nftId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 precio,
    bool vendido
  );

  /* Devolvemos el precio del gas */
  function getPrecioGas() public view returns (uint256) {
    return precioGas;
  }
  
  /* Función que pone un NFT en el mercado */
  function ponerNFTMercado(address nftContract, uint256 tokenId, uint256 precio) public payable nonReentrant {
    require(precio > 0, "El precio no puede ser 0 o negativo"); //Restricción de precios
    require(msg.value == precioGas, "El precio debe ser mayor que el precio del gas"); //Restricción de precios

    _nftIds.increment();
    uint256 nftId = _nftIds.current();

    // Guardamos el nuevo NFT en el mapa del mercado
    marketNFTs[nftId] =  MarketNFT(
      nftId, // Id nuevo
      nftContract,
      tokenId,
      payable(msg.sender), // Vendedor es el que pone a vender el NFT
      payable(address(0)), 
      precio,
      false // false porque si lo ponemos a la venta, no está vendido
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); // Transfer(from, to, id)

    /* Emitimos el evento con los datos del NFT que guardamos en el mercado*/
    emit CrearMarketNFT(
      nftId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      precio,
      false
    );
  }

  /* Función para comprar un NFT, realizando los cambios en los campos owner y vendido */
  function compraNFT(address nftContract, uint256 nftId) public payable nonReentrant {
    uint tokenId = marketNFTs[nftId].tokenId; // Recogemos el id del NFT

    console.log("El antiguo seller es: %s", marketNFTs[nftId].seller);
    console.log("El precio de compra ha sido de : %s", msg.value, ' ETH');

    marketNFTs[nftId].seller.transfer(msg.value); 
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); // Transfer(from, to, id)
    marketNFTs[nftId].owner = payable(msg.sender); // Cambiamos el propietario del NFT por el adquisidor del NFT
    marketNFTs[nftId].vendido = true; // Ponemos a true el campo "vendido"
    _nftsVendidos.increment();
    payable(owner).transfer(precioGas); // El comprador paga el precio del gas
  }

  /* Función que devuelve todos los NFTs que no han sido vendidos */
  function getNFTsMercado() public view returns (MarketNFT[] memory) {
    uint numeroNFTs = _nftIds.current(); // El ID actual, es el número de NFTs 
    uint NFTsNoVendidos = _nftIds.current() - _nftsVendidos.current();
    uint currentIndex = 0;

    MarketNFT[] memory nfts = new MarketNFT[](NFTsNoVendidos); // Creamos un array de NFTs no vendidos

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].owner == address(0)) { // Seleccionamos los NFTs que no tienen owner
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
      if (marketNFTs[i + 1].seller == msg.sender) {
        nftCount += 1;
      }
    }

    MarketNFT[] memory nfts = new MarketNFT[](nftCount); // Creamos un array de los NFTs de un usuario 

    for (uint i = 0; i < numeroNFTs; i++) {
      if (marketNFTs[i + 1].seller == msg.sender) { // Seleccionamos los NFTs del usuario que él es el seller
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