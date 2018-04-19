class Url {
  constructor( url ) {
    this.url = url;
  }

  /* Mock functions */
  addEventListener() { return this; }
  removeEventListener() { return this; }
  close() {}

  open( options = {}) {
    const {
      replaceUrl = false,
    } = options;

    if ( replaceUrl )
      window.location.replace( this.url );
    else
      window.location.href = this.url;
  }

  append( string ) {
    this.url += string;

    return this;
  }
}

export default Url;
