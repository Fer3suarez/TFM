import Link from 'next/link'
import Head from "next/head";

import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers'

import {
  nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

function GaleriaArte({ Component, pageProps }) {

  const [cuentaActual, setCuentaActual] = useState('')
  const [balance, setBalance] = useState('')
	const [dropdownOpen, setDropdownOpen] = useState(false)

  // Obtener cuenta actual
	const obtenerCuenta = async () => {
		const { ethereum } = window
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const balan = await ethereum.request({ method: 'eth_getBalance', params: [accounts[0], "latest"]})
    //balan = ethers.utils.formatEther(ethers.utils.parseEther(balance));
    balance = parseInt(balan) / 1000000000000000000

		if (accounts.length !== 0) {
			setCuentaActual(accounts[0])
      setBalance(balance)
		} else {
			console.log('No authorized account found')
		}
	}

  useEffect(() => {
		obtenerCuenta()
	}, [])

  return (
    <>
    <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous" />
    </Head>
    {cuentaActual ? (
      <div className='container-fluid'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className='container-fluid'>
            <a className="navbar-brand justify-content-start" href="http://localhost:3000/">
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-disc" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 4a4 4 0 0 0-4 4 .5.5 0 0 1-1 0 5 5 0 0 1 5-5 .5.5 0 0 1 0 1zm4.5 3.5a.5.5 0 0 1 .5.5 5 5 0 0 1-5 5 .5.5 0 0 1 0-1 4 4 0 0 0 4-4 .5.5 0 0 1 .5-.5z"/>
            </svg>
            </a>
            <h1 className='justify-content-start'>Galeria de Arte Digital</h1>
            <ul className="nav nav-pills justify-content-end">
              <li className="nav-item navbar-right"><Link href="/">
                <a className="nav-link">
                  Galeria
                </a>
              </Link></li>
              <li className="nav-item navbar-right"><Link href="/subir-nft">
                <a className="nav-link">
                  Subir NFT
                </a>
              </Link></li>
              <li className="nav-item navbar-right"><Link href="/mis-nft">
                <a className="nav-link">
                  Mis NFTs
                </a>
              </Link></li>
              <li className="nav-item navbar-right"><Link href="/registro">
                <a className="nav-link">
                  Registro
                </a>
              </Link></li>
            </ul>
          </div>
          <button type="button" data-bs-toggle="offcanvas" data-bs-target="#demo" className="btn float-end" style={{justifyContent: "border: none; background: transparent"}} onClick={() => dropdownOpen ? setDropdownOpen(false) : setDropdownOpen(true)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              fill='currentColor'
              className='bi bi-person-circle'
              viewBox='0 0 16 16'
            >
              <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
              <path
                fillRule='evenodd'
                d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
              />
            </svg>
          </button>
        </nav>
        <Modal toggle={() => setDropdownOpen(!dropdownOpen)} isOpen={dropdownOpen}>
          <div className=" modal-header">
            <h5 className=" modal-title">Detalles de la cuenta</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setDropdownOpen(!dropdownOpen)}></button>
          </div>
          <ModalBody>
            Cuenta: <span>{cuentaActual}</span><br></br>
            Balance: <span>{balance}</span> ETH
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
        <br></br>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossOrigin="anonymous"></script>
        <Component {...pageProps} />
      </div>
    ) : (
      <div className='container-fluid vh-100 row m-0 text-center justify-content-center align-items-center'>
        <div className="col ">
          <div className="spinner-border" style={{width: "300px", height: "300px"}} role="status"></div>
        </div>
      </div>
    )}
      
    </>
  )
}

export default GaleriaArte