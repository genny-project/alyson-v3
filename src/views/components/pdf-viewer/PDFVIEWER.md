# PdfViewer Component

## Description

PdfViewer allows to render a pdf on the screen

## Gotchas

Some Documents may not be rendered because of CORS policy please see the console if such things happen

## Usgae for Layouts

```json
{
  "component": "PdfViewer",
  "props": {
    "file": "name of a file , random file will not      work and also check for the CORS Policy",
    "style": {
      "color": "whitesmoke",
      "padding": "0px"
    }
  }
}

```