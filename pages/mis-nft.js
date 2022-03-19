import {  ethers } from 'ethers'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import {
  nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function MisNFTs() {
  const [nfts, setNfts] = useState([])
  const [nft, setNft] = useState({})
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [precio, setPrecio] = useState('')

  const router = useRouter()
  useEffect(() => {
    cargarNFTs()
  }, [])

  const handleChange = useCallback(
		(e) => {
			setPrecio(e.target.value)
		},
		[setPrecio]
	)

 async function venderNFT(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const nftData = await marketContract.tokenURI(nft.tokenId)
    const data = await axios.get(nftData)

    setLoadingState("loaded")
    setNft(data.data)

    let precioGas = await marketContract.getPrecioGas()
    precioGas = precioGas.toString()
    const nftPrecio = ethers.utils.parseUnits(precio.toString(), 'ether')
  
    let tx = await marketContract.resellToken(
      nft.tokenId,
      nftPrecio,
      { value: precioGas }
    )

    await tx.wait()
    setLoadingState('loaded') 
    router.push('/')
  }

  async function cargarNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)  
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const data = await marketContract.getMisNFTs()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenURI = await marketContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let precio = ethers.utils.formatUnits(i.precio.toString(), 'ether')

      let nft = {
        nombre: meta.data.nombre,
        precio,
        descripcion: meta.data.descripcion,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        imagen: meta.data.imagen,
        tokenURI,
        enVenta: i.enVenta
      }
      return nft
    }))

    setNfts(nfts)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) 
    return (
      <div className="container">
        <hr className="mt-2 mb-5"></hr>
        <h1 className="py-10 px-20 text-3xl alert alert-warning text-center">
          No tengo NFTs
        </h1>
      </div>
    )
  return (
    <div className="container">
      <h2>Mis NFTs</h2>
      <hr className="mt-2 mb-5"></hr>
      <div className="row text-center text-lg-start">
        {
          nfts.map((nft, i) => (
            <div key={i} className="col-lg-3 col-md-4 col-6">
              <div className="card">
                <div className="card-header">
                  <p className="card-title ">Token ID: {nft.tokenId}</p>
                </div>
                <img src={nft.imagen} className="img-fluid img-thumbnail"/>
                <div className="card-body">
                  <p className="card-text">Nombre: {nft.nombre}</p>
                  <p className="card-text">Descripción: {nft.descripcion}</p>
                  <p className="card-text">Precio inicial - {nft.precio} ETH</p>
                  <div>
                    { !nft.enVenta ? (
                      <input
                        required
                        type='number'
                        onChange={handleChange}
                        name='name'
                        placeholder='Precio de venta NFT'
                        className='form-control col-md-2'
                        autoComplete='off'
                      />
                    ) : (
                      <div>
                        <button disabled className="btn btn-danger rounded mx-auto d-block">NFT ya en el mercado</button>
                      </div>
                    )}
                  </div>
                  <br></br>
                  { precio !== "" ? (
                    <button onClick={() => venderNFT(nft)} className="btn btn-primary rounded mx-auto d-block">Poner a la venta por: {precio} ETH</button>
                  ) : !nft.enVenta ? (
                    <button disabled className="btn btn-primary rounded mx-auto d-block">Poner a la venta por: {precio} ETH</button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <hr></hr>
          </div>
          ))
        }
      </div>
    </div>
  )
}