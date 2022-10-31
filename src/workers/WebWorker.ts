/* eslint-disable no-restricted-globals */
const WebWorker = () => {
  const BLE = {
    connect: () => {
      if (!navigator) return

      console.info('WebWorker.ts:6', navigator)
    },
  }

  onmessage = (event: MessageEvent) => {
    console.info('WebWorker.ts:4', event.data)

    switch (event.data.toLowerCase()) {
      case 'ping':
        postMessage('Pong')
        break
      case 'connect':
        BLE.connect()
        break

      default:
        break
    }
  }
}

export default new Worker(
  URL.createObjectURL(
    new Blob([`(${WebWorker.toString()})()`])
  )
)
