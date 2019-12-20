const PdfPrinter = require("pdfmake");
const path = require("path"); 
const fs = require("fs-extra"); 



const generatePDF = (book) =>
  new Promise((resolve, reject) => {
    // I'm returning a Promise because I want to await to the process of creating a PDF
    try {
      // Define font files
      var fonts = {
        Roboto: {
          normal: "Helvetica",
          bold: "Helvetica-Bold",
          italics: "Helvetica-Oblique",
          bolditalics: "Helvetica-BoldOblique"
        }
      };
      const printer = new PdfPrinter(fonts); // create new PDF creator


      const  tableDetails = {
        widths: [100, '*', 200, '*'],
        body:[['Column 1', 'Column 2', 'Column 3', 'Column 4']]
      }


      // "asin": "0425264041",
      // "title": "Maryline (The Extinction Files, Book 1)",
      // "price": 20.73,
      // "category": "scifi",
      // "createdAt": "2019-12-19T21:12:14.822Z",
      // "updateAt": "2019-12-19T21:12:14.822Z",
      // "_id": "5d97542a-9ebc-497a-ad7f-a3bd61a4cddf",
      // "updatedAt": "2019-12-19T21:19:02.924Z",
      // "imageUrl": "/images/5d97542a-9ebc-497a-ad7f-a3bd61a4cddf.png"


      const {category, title , imageUrl, price, asin} = book
      tableDetails.body = [...tableDetails.body,[category, title , asin, price] ]  

      const file = path.join(__dirname, `../../${imageUrl}`);
      const date = new Date()

      const greeting = `Have your ticket for ${title}
      
      ${date}`;

      const  url = 'http://jeff-ofoaro.tech';

      header=(text)=>{
        return { text: text, margins: [0, 0, 0, 10] };
      }

// const longText = 'The amount of data that can be stored in the QR code symbol depends on the datatype (mode, or input character set), version (1, …, 40, indicating the overall dimensions of the symbol), and error correction level. The maximum storage capacities occur for 40-L symbols (version 40, error correction level L):'







     
      const docDefinition = {
        // In here we define what we want to put into our PDF
        content: [
            {
                table: tableDetails
            },
            {
              image: file,
              width: 150
            },
            
            { qr: url, fit: 150, alignment: 'right' },
            header(greeting)
        ]
      };

      // We will be using streams to create the pdf file on disk
      const pdfDoc = printer.createPdfKitDocument(docDefinition, {}); // pdfDoc is our source stream
      pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, `${asin}.pdf`))); // we pipe pdfDoc with the destination stream, which is the writable stream to write on disk
      pdfDoc.end();
      resolve(); // the promise is satisfied when the pdf is successfully created
    } catch (error) {
      console.log(error);
      reject(error); // if we are having errors we are rejecting the promise
    }
  });

module.exports = generatePDF;

