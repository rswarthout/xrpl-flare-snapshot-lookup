import React from 'react';
import axios from "axios";
var moment = require('moment');
var rippleRegex = require('ripple-regex');

export default class Index extends React.Component {

    constructor() {
        super();
        this.state = {
            lookingUpAddress: false,
            loadingFailed: false,
            isAddressValid: false,
            xrplAddress: ""
        };

        this.getAddressDetails = this.getAddressDetails.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    checkforValidAddressFormat(string) {
        return rippleRegex({exact: true}).test(string);
    }

    handleAddressChange(event) {
        let value = event.target.value;

        this.setState({
            isAddressValid: this.checkforValidAddressFormat(value)
        });

        this.setState({
            xrplAddress: value
        });
    }

    handleSubmit(event) {

        event.preventDefault();

        this.setState({
            isAddressValid: this.checkforValidAddressFormat(this.state.xrplAddress)
        });

        if (this.state.isAddressValid === false) {
            return;
        }

        if (this.state.lookingUpAddress) {
            return;
        }

        this.setState({
            lookingUpAddress: true,
            loadingFailed: false,
            addressDetails: null
        });

        this.getAddressDetails();
    }

    async getAddressDetails() {
        var self = this;

        let data = await axios
            .get("https://api.towo.io/v2/spark/info/" + this.state.xrplAddress)
            .then(function (response) {
                return response;
            })
            .catch(function(error) {
                self.setState({
                    loadingFailed: true
                });
                console.log(error);
            });

        this.setState({
            lookingUpAddress: false
        });

        if (data) {
            this.setState({
                addressDetails: data.data
            });
        }
    }

    render() {

        let addressDetails = "";

        if (this.state.loadingFailed) {
            addressDetails = (
                <div className="rounded-lg shadow bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error loading the wallet address
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>
                                    The address provided above could not be loaded. Please review the address.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.lookingUpAddress === true) {
            addressDetails = (
                <div className="text-center">
                    <svg className="animate-spin  inline-block -mt-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading address details
                </div>
            );
        } else if (this.state.addressDetails) {

            let snapshotDate = moment('2020-12-12T00:00:00Z', "YYYY-MM-DDTHH:mm:ssZ");

            addressDetails = (
                <div>
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Account Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                The amounts shown below are calculated from the XRPL snapshot taken on <br /><span className="font-bold">{ snapshotDate.format('YYYY-MM-DD HH:mm:ss Z') }</span>.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        XRPL Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words">
                                        { this.state.addressDetails.xrplAddress }
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        XRP Balance
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        { this.state.addressDetails.xrpBalance }
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Flare Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words">
                                        { this.state.addressDetails.flareAddress }
                                        <div className="text-xs text-gray-400">(If this is not the address you were expecting, data is still being synced from the snapshot.)</div>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Spark Claim
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        { this.state.addressDetails.sparkClaim }
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-2 text-gray-400 text-sm text-center">The data shown above is provided by <a href="https://towo.io/" className="underline">Towo Labs snapshot API</a>.</div>
                </div>
            );
        }

        return (
            <div className="max-w-screen-xl mx-auto px-2 pb-6">

                <div className="mt-2 md:mt-10 text-center space-x-5 md:space-x-20">
                    <img className="inline-block mx-auto" src="/assets/img/flare-xrp-logo.png" />
                </div>

                <div className="mt-10 text-bold text-center text-gray-900 text-2xl">XRPL - Flare snapshot claim lookup</div>
                <div className="mt-1 text-center text-gray-600">Details of the XRPL snapshot and corresponding calculation of the Spark claim ratio (1.0073) <a href="https://blog.flare.xyz/the-xrp-flr-ratio/" className="underline" target="_blank">can be found here</a>.</div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={this.handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    XRPL Address
                                </label>
                                <div className="mt-1">
                                    <input id="xrpl-address" name="xrpl-address" placeholder="rTooLkitCksh5mQa67eaa2JaWHDBnHkpy" value={this.state.xrplAddress} onChange={this.handleAddressChange} type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={!this.state.isAddressValid} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                                    Lookup Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-10 mx-auto max-w-2xl">
                    { addressDetails }
                </div>

            </div>
        );
    }
}