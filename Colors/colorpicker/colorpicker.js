$(function () {
 
    var tableViewModel = function(){
        var self = this;
        self.rows = ko.observableArray();

        self.refresh = function(){
            var data = self.rows().slice(0);
            self.rows([]);
            self.rows(data);
        };

        self.addRow = function(){
            self.rows.push(new rowViewModel('0x0088920E'))
            var pickerId = 'colorPicker_' + (self.rows().length - 1);

            self.rows.valueHasMutated();

            console.log('pickerId = ' + pickerId);
            console.log('length =  ' + $('#' + pickerId).length);

            $('#' + pickerId).colorpicker({  
                format: 'hex',
                customClass: 'colorpicker-2x',
                sliders: {
                    saturation: {
                        maxLeft: 200,
                        maxTop: 200
                    },
                    hue: {
                        maxTop: 200
                    },
                    alpha: {
                        maxTop: 200
                    }
                }
            });
        };

      
    }


    var rowViewModel = function(fileValue){
        var self = this;

        self.red = ko.observable();
        self.green = ko.observable();
        self.blue = ko.observable();
      
        self.redHex = getComputedHexFromDecimal(self.red);
        self.greenHex =  getComputedHexFromDecimal(self.green);
        self.blueHex =  getComputedHexFromDecimal(self.blue);
  
        function getComputedHexFromDecimal(decimal){
            return ko.pureComputed({
                read: function(){
                    if(!decimal()){
                        return '00';
                    }

                    var value = parseInt(decimal(), 10).toString(16).toUpperCase();                

                    if(value.length == 1){
                        return '0' + value;
                    }

                    return value;
                },
                write: function(value){
                    decimal(parseInt(value, 16));
                },
                owner: self
            });
        }

        //0x008812C7
        //reverse order of colors
        self.file = ko.pureComputed({
            read: function(){
                return '0x00' + self.blueHex() + self.greenHex() + self.redHex();   
            },
            write: function(value){               
                self.blueHex(value.substring(4, 6));
                self.greenHex(value.substring(6, 8));
                self.redHex(value.substring(8, 10));
            },
            owner: self
        });
 

        self.valueHtml = ko.pureComputed(function(){
            return '#' + self.redHex() + self.greenHex() + self.blueHex();
        });


        //#2F7CB3
        self.picker = ko.pureComputed({
            read: function(){          
                var value = self.valueHtml().toLowerCase();
                $('#colorPicker').colorpicker('setValue', value);
                return value;               
            },
            write: function(value){            
                var htmlValue = value.toUpperCase();               
                self.redHex(htmlValue.substring(1, 3));
                self.greenHex(htmlValue.substring(3, 5));
                self.blueHex(htmlValue.substring(5, 7));         
            },
            owner: self
        });    
     
        self.file(fileValue);
    };

    ko.applyBindings(new tableViewModel());	
});

