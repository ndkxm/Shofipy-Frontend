import React, { useState } from 'react'
import { Loader } from '../shared/Loader';
import { FaAddressBook } from 'react-icons/fa';
import { AddressInfoModal } from './AddressInfoModal';
import { AddressList } from './AddressList';
import { useSelector } from 'react-redux';

export const AddressInfo = ({ addresses }) => {
    const noAddressExist = !addresses || addresses.length === 0;
    const isLoading = false;

    const { selectedCheckoutAddress } = useSelector((state) => state.auth);

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(selectedCheckoutAddress || "");
    const addNewAddressHanlder = () => {
        setSelectedAddress("");
        setOpenAddressModal(true);
    }
    return (
        <div>
            {
                noAddressExist ? (
                    <div className='text-center text-slate-700'>
                        <div className='flex justify-center mb-2'>
                            <FaAddressBook size={50} />
                        </div>
                        <h1 className='lg:text-2xl text-l font-bold'>No Address Added Yet</h1>
                        <p className='lg:text-xl text-sm'>Please add address to complete purchase</p>
                        <button className='py-2 px-5 bg-blue-500 hover:bg-blue-700 transition-all duration-300 cursor-pointer rounded-2xl mt-3 text-white' onClick={addNewAddressHanlder}>
                            Add new address
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col items-center'>
                        <h1 className='lg:text-3xl text-2xl font-bold'>
                            Select Address
                        </h1>

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="flex flex-col justify-center">
                                <div className="">
                                    <AddressList addresses={addresses} onSelect={setSelectedAddress} selectedAddress={selectedAddress} />
                                </div>
                                <button className='py-2 px-5 bg-blue-500 hover:bg-blue-700 transition-all duration-300 cursor-pointer rounded-2xl mt-3 text-white' onClick={addNewAddressHanlder}>
                                    Add new address
                                </button>
                            </div>


                        )}
                    </div>
                )
            }
            <AddressInfoModal
                open={openAddressModal}
                onClose={() => setOpenAddressModal(false)}
            />
        </div>
    )
}
