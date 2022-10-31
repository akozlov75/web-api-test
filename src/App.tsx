/// <reference types="web-bluetooth" />
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import logo from './logo.svg'
import './App.css'
import WebWorker from './workers/WebWorker'

const App = () => {
  const [device, setDevice] = useState<BluetoothDevice>()
  const [deviceConnected, setDeviceConnected] = useState<boolean>(false)
  useEffect(() => {
    WebWorker.onmessage = (event: MessageEvent) => {
      console.info('App.tsx:11', event.data)
    }
  }, [])

  const handleBluetoothConnect = async () => {
    try {
      console.info('App.tsx:20', navigator)
      if (!navigator || !navigator?.bluetooth) return

      // see: https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth
      const foundedDevice = await navigator.bluetooth.requestDevice({
        // filters: [
        //   { name: 'LE_WF-1000XM4' },
        //   { name: 'WF-1000XM4' },
        //   { namePrefix: 'ScanWatch' },
        //   { namePrefix: 'oura' },
        //   { services: ['heart_rate'] },
        // ],
        acceptAllDevices: true
      })
      setDevice(() => foundedDevice)
      console.info('App.tsx:28', device)

      const connectResp = await foundedDevice?.gatt?.connect()
      console.info('App.tsx:31', connectResp)
      setDeviceConnected(!!connectResp?.connected)
    } catch (error) {
      console.error('App.tsx:35', error)
      if (device?.gatt?.connected) device.gatt.disconnect()
    }
  }

  const handleBluetoothDisconnection = async () => {
    try {
      await device?.gatt?.disconnect()
      console.info('App.tsx:43', device)

      setDevice(undefined)
      setDeviceConnected(false)
    } catch (error) {
      console.error('App.tsx:48', error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => WebWorker.postMessage('Ping')}>
          Send message to web worker
        </button>
        <button onClick={handleBluetoothConnect} className={classnames({hidden: deviceConnected})}>
          Connect to BLE device
        </button>
        <button onClick={handleBluetoothDisconnection} className={classnames({hidden: !deviceConnected})}>
          Disconnect from BLE device
        </button>
      </header>
    </div>
  )
}

export default App
