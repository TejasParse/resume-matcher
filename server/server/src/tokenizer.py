#encoding: utf-8

import PyPDF4
from nltk.corpus import stopwords

import pdfplumber

def tokenize(path):
    # open PDF
    # pdfFileObj = open(path, 'rb')
    # pdfReader = PyPDF4.PdfFileReader(pdfFileObj)
    stopword_list = list(stopwords.words("english"))

    pdf_content = []

    with pdfplumber.open(rf'{path}') as pdf:
               
    
        for i in range(len(pdf.pages)):
            pageObj = pdf.pages[i]
            pdf_content.append(pageObj.extract_text())

        
        tokenize = []
        for line in pdf_content:
            tokenize = filter(None,(line.split(" ")))

        
        no_punctuations = []
        for token in tokenize:
            no_punctuations.append(token.rstrip(",:|.-\n").lower())

       
        without_stop_words = []
        
        for word in filter(None, no_punctuations):
            if word not in stopword_list:
                without_stop_words.append(word)

        return without_stop_words