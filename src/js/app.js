App= {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3()
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
          } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
          }
          return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("MoulaTokenSale.json", function(MoulaTokenSale) {
            App.contracts.MoulaTokenSale = TruffleContract(MoulaTokenSale);
            App.contracts.MoulaTokenSale.setProvider(App.web3Provider);
            App.contracts.MoulaTokenSale.deployed().then(function(instance) {
                console.log("Moula Token Sale Address: ", instance.address)
            })
        }).done(function() {
            $.getJSON("MoulaToken.json", function(MoulaToken) {
                App.contracts.MoulaToken = TruffleContract(MoulaToken);
                App.contracts.MoulaToken.setProvider(App.web3Provider);
                App.contracts.MoulaToken.deployed().then(function(instance) {
                    console.log("Moula Token Address: ", instance.address)
                });
                return App.render();
            });
        });
    },

    render: function() {
        if(window.ethereum)
        {
            ethereum.request({ method: 'eth_requestAccounts' }).then(function(acc) {
                App.account = acc[0];
                $("#accountAddress").html("Your Account: " + App.account);
            });
        }
    }
    
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});