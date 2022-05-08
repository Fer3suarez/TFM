describe("Market", function() {
    it("Se crean dos NFTs y se realiza una compra y una venta", async function() {
      /* deploy the marketplace */
      const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
      const nftMarket = await NFTMarket.deploy();
      await nftMarket.deployed();
  
      let precioGas = await nftMarket.getPrecioGas()
      precioGas = precioGas.toString()
  
      const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  
      /* create two tokens */
      await nftMarket.createToken("https://www.mytokenlocation.com", auctionPrice, { value: precioGas })
      await nftMarket.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: precioGas })
        
      const [_, buyerAddress] = await ethers.getSigners()
    
      /* execute sale of token to another user */
      await nftMarket.connect(buyerAddress).compraNFT(1, { value: auctionPrice })
  
      /* resell a token */
      await nftMarket.connect(buyerAddress).venderNFT(1, auctionPrice, { value: precioGas })
  
      /* query for and return the unsold items */
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
      console.log('items: ', items)
    })
  })