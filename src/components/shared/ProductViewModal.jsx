import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Divider from '@mui/material/Divider'
import { useState } from 'react'
import { MdDone, MdClose } from 'react-icons/md'
import Status from './Status';

const ProductViewModal = ({ open, setOpen, product, isAvailable }) => {

    const { productId, productName, image, description, quantity, price, discount, specialPrice } = product;

    const handleClickOpen = () => {
        setOpen(true);
    }

    return (
        <div>
            <Dialog open={open} as="div" className="relative z-60" onClose={() => setOpen(false)}>
                /* Layout */
                <DialogBackdrop className="fixed inset-0 bg-gray-500 opacity-65 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-lg rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            {
                                image && (
                                    <div className='flex justify-center aspect-[3/2]'>
                                        <img src={image} alt={productName} className='cursor-pointer rounded-xl w-full h-full transition-transform duration-200 mb-5' />
                                    </div>
                                )
                            }
                            <DialogTitle as="h3" className="text-2xl font-medium text-black">
                                {productName}
                            </DialogTitle>
                            <div className='flex items-center justify-between'>
                                {specialPrice
                                    ? (
                                        <div>
                                            <span className="my-1 mr-2">
                                                <span className="text-gray-800 font-bold text-md">${Number(specialPrice).toFixed(2)}</span>
                                            </span>
                                            <span className="my-1">
                                                <span className="text-gray-400 line-through font-bold text-md">${Number(price).toFixed(2)}</span>
                                            </span>
                                        </div>
                                    )
                                    : (
                                        <div className="px-4 pb-5">
                                            <span className="text-gray-800 font-bold">
                                                {"  "}
                                                ${Number(price).toFixed(2)}
                                            </span>
                                        </div>
                                    )
                                }
                                <div className='flex'>
                                    {isAvailable ? (
                                        <Status
                                            text="In Stock"
                                            icon={MdDone}
                                            bg="bg-teal-200"
                                            color="text-teal-900"
                                        />
                                    ) : (
                                        <Status
                                            text="Out of Stock"
                                            icon={MdClose}
                                            bg="bg-rose-200"
                                            color="text-rose-700"
                                        />
                                    )
                                    }
                                </div>
                            </div>
                            
                            <Divider />

                            <p className="mt-2 text-md text-black/50 my-2">
                                {description}
                            </p>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    className="flex items-center cursor-pointer gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default ProductViewModal;