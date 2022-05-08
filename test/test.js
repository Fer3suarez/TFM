describe("** Paquete de pruebas del contrato inteligente Market.sol **", function() {
    it("Se crean dos NFTs y se realiza una compra y una venta", async function() {
      /* Despliegue del contrato inteligente */
      const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
      const nftMarket = await NFTMarket.deploy();
      await nftMarket.deployed();
  
      let precioGas = await nftMarket.getPrecioGas()
      precioGas = precioGas.toString()
  
      const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  
      /* Creación de dos NFTs */
      console.log(' - Creando dos NFTs')
      await nftMarket.createToken("https://www.mytokenlocation.com", auctionPrice, { value: precioGas })
      await nftMarket.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: precioGas })
        
      const [_, buyerAddress] = await ethers.getSigners()
    
      /* Compra de un NFT */
      console.log(' - Compra de un NFT con tokenID: 1')
      await nftMarket.connect(buyerAddress).compraNFT(1, { value: auctionPrice })
  
      /* Venta de un NFT */
      console.log(' - Puesta en venta de un NFT con tokenID: 1')
      await nftMarket.connect(buyerAddress).venderNFT(1, auctionPrice, { value: precioGas })
  
      /* NFTs no vendidos */
      items = await nftMarket.getNFTsMercado()
      items = await Promise.all(items.map(async i => {
        const tokenUri = await nftMarket.tokenURI(i.tokenId)
        let item = {
          precio: i.precio.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))
      console.log(' - NFTs puestos en venta: ', items)
    })
  })