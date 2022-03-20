import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Web3Modal from "web3modal"


import {
  nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Galeria() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [cuentaActual, setCuentaActual] = useState('')
  const router = useRouter()
  useEffect(() => {
    obtenerCuenta()
    loadNFTs()
  }, [])

  // Obtener cuenta actual
	const obtenerCuenta = async () => {
		const { ethereum } = window
    const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			setCuentaActual(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}
  
  async function loadNFTs() {    
    const provider = new ethers.providers.JsonRpcProvider()
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.getNFTsMercado()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenUri = await marketContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let precio = ethers.utils.formatUnits(i.precio.toString(), 'ether')
      let nft = {
        precio,
        nftId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        imagen: meta.data.imagen,
        nombre: meta.data.nombre,
        descripcion: meta.data.descripcion,
      }
      return nft
    }))
    setNfts(nfts)
    setLoadingState('loaded') 
  }

  async function comprarNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection) 
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const precio = ethers.utils.parseUnits(nft.precio.toString(), 'ether')
    const transaccion = await contract.compraNFT(nft.nftId, {
      value: precio
    })
    await transaccion.wait()
    loadNFTs()
    //router.push('/mis-nft')
  }
  if (loadingState === 'loaded' && !nfts.length) 
    return (
      <div className="container">
        <hr className="mt-2 mb-5"></hr>
        <h1 className="py-10 px-20 text-3xl alert alert-warning text-center">
          No hay NFTs en el mercado
        </h1>
      </div>
    )
  return (
    <div className="container">
      <h2>Galeria</h2>
      <hr className="mt-2 mb-5"></hr>
      <div className="row text-center text-lg-start">
        {
          nfts.map((nft, i) => (
            <div key={i} className="col-lg-3 col-md-4 col-6">
                <div className="card">
                  <img src={nft.imagen} className="img-fluid img-thumbnail" alt="{nft.nombre}"/>
                  <div className="card-body">
                    <h5 className="card-title">{nft.nombre}</h5>
                    <p className="card-text">{nft.descripcion}</p>
                    {cuentaActual.toUpperCase() === nft.seller.toUpperCase() ? (
                      <button disabled className="btn btn-danger rounded mx-auto d-block">No puedo comprar mi NFT</button>
                    ) : (
                      <button onClick={() => comprarNFT(nft)} className="btn btn-primary rounded mx-auto d-block">Comprar: {nft.precio} ETH</button>
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
