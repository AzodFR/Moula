App= {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 500000000000000,
    tokensAvailable: 525500,
    tokensSold: 0,
    balance: 0,

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
                App.listenEvents();
                return App.render();
            });
        });
    },

    listenEvents: function() {
        App.contracts.MoulaTokenSale.deployed().then(function(instance) {
            instance.Sell ({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, events) {
                console.log("Events triggered", events);
                App.render();
            })
        })
    },

    render: function() {
        if(App.loading) { return; }
        App.loading = true;
        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();
        if(window.ethereum)
        {
            ethereum.request({ method: 'eth_requestAccounts' }).then(function(acc) {
                App.account = acc[0];
                $("#accountAddress").html("Your Account: " + App.account);
            }).then(function() {
                App.contracts.MoulaTokenSale.deployed().then(function(instance) {
                    moulaInstance = instance;
                    return moulaInstance.tokenPrice();
                }).then(function(price) {
                    App.tokenPrice = price;
                    $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
                    return moulaInstance.tokensSold();
                }).then(function(sold) {
                    App.tokensSold = sold.toNumber();
                    $('.tokens-sold').html(App.tokensSold);
                    $('.tokens-available').html(App.tokensAvailable);

                    var progressPercent =  ( Math.ceil(App.tokensSold) / App.tokensAvailable ) * 100;
                    $('#progress').css('width', progressPercent + '%');
                    App.contracts.MoulaToken.deployed().then(function(instance) {
                        tokenInstance = instance;
                        return tokenInstance.balanceOf(App.account);
                    }).then(function(balance) {
                        App.balance = balance.toNumber();
                        $('.moula-balance').html(App.balance);      
                        App.loading = false;
                        loader.hide();
                        content.show();
                    })
                });
            });
        }
    },
 
    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.MoulaTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, { 
                from: App.account, 
                value : numberOfTokens * App.tokenPrice, 
                gas: 500000
            });
        }).then(function(result) {
            console.log("Tokens bought...");
            $('form').trigger('reset');
        })
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});