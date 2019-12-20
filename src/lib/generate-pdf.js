const PdfPrinter = require("pdfmake");
const path = require("path"); 
const fs = require("fs-extra"); 



const generatePDF = (allBooks) =>
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
        body:[['Title', 'Year', 'imdbI', 'Type']]
      }


    //   "Title": "Titanic",
    //   "Year": "1997",
    //   "imdbID": "tt0120338",
    //   "Type": "movie",
    //   "Poster": "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg"

    allBooks.map(onebook=>{

      const {Title, Year , imdbID, Type, Poster} = onebook
      tableDetails.body = [...tableDetails.body,[Title, Year , imdbID, Type] ]  
    })


    const file = path.join(__dirname, `../../${Poster}`);
    const date = new Date()

    const greeting = `Have your ticket for ${Title}
    
    ${date}`;

    const  url = 'http://jeff-ofoaro.tech';

    header=(text)=>{
      return { text: text, margins: [0, 0, 0, 10] };
    }
     
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
      pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, `allBooks.pdf`))); // we pipe pdfDoc with the destination stream, which is the writable stream to write on disk
      pdfDoc.end();
      resolve(); // the promise is satisfied when the pdf is successfully created
    } catch (error) {
      console.log(error);
      reject(error); // if we are having errors we are rejecting the promise
    }
  });

module.exports = generatePDF;
