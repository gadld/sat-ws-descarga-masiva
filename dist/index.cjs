"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  AbstractRfcFilter: () => AbstractRfcFilter,
  AuthenticateTranslator: () => AuthenticateTranslator,
  BaseEnum: () => BaseEnum,
  CRequest: () => CRequest,
  CResponse: () => CResponse,
  CfdiFileFilter: () => CfdiFileFilter,
  CfdiPackageReader: () => CfdiPackageReader,
  CodeRequest: () => CodeRequest,
  ComplementoCfdi: () => ComplementoCfdi,
  ComplementoRetenciones: () => ComplementoRetenciones,
  ComplementoUndefined: () => ComplementoUndefined,
  CreateTemporaryZipFileException: () => CreateTemporaryZipFileException,
  CsvReader: () => CsvReader,
  DateTime: () => DateTime,
  DateTimePeriod: () => DateTimePeriod,
  DocumentStatus: () => DocumentStatus,
  DocumentType: () => DocumentType,
  DownloadResult: () => DownloadResult,
  DownloadTranslator: () => DownloadTranslator,
  DownloadType: () => DownloadType,
  Fiel: () => Fiel,
  FielRequestBuilder: () => FielRequestBuilder,
  FilteredPackageReader: () => FilteredPackageReader,
  Helpers: () => Helpers,
  HttpClientError: () => HttpClientError,
  HttpServerError: () => HttpServerError,
  HttpsWebClient: () => HttpsWebClient,
  InteractsXmlTrait: () => InteractsXmlTrait,
  MetadataContent: () => MetadataContent,
  MetadataFileFilter: () => MetadataFileFilter,
  MetadataItem: () => MetadataItem,
  MetadataPackageReader: () => MetadataPackageReader,
  MetadataPreprocessor: () => MetadataPreprocessor,
  NullFileFilter: () => NullFileFilter,
  OpenZipFileException: () => OpenZipFileException,
  PackageReaderException: () => PackageReaderException,
  QueryParameters: () => QueryParameters,
  QueryResult: () => QueryResult,
  QueryTranslator: () => QueryTranslator,
  RequestBuilderException: () => RequestBuilderException,
  RequestType: () => RequestType,
  RfcMatch: () => RfcMatch,
  RfcMatches: () => RfcMatches,
  RfcOnBehalf: () => RfcOnBehalf,
  Service: () => Service,
  ServiceConsumer: () => ServiceConsumer,
  ServiceEndpoints: () => ServiceEndpoints,
  ServiceType: () => ServiceType,
  SoapFaultError: () => SoapFaultError,
  SoapFaultInfo: () => SoapFaultInfo,
  SoapFaultInfoExtractor: () => SoapFaultInfoExtractor,
  StatusCode: () => StatusCode,
  StatusRequest: () => StatusRequest,
  ThirdPartiesExtractor: () => ThirdPartiesExtractor,
  ThirdPartiesFileFilter: () => ThirdPartiesFileFilter,
  ThirdPartiesRecords: () => ThirdPartiesRecords,
  Token: () => Token,
  Uuid: () => Uuid,
  VerifyResult: () => VerifyResult,
  VerifyTranslator: () => VerifyTranslator,
  WebClientException: () => WebClientException
});
module.exports = __toCommonJS(index_exports);

// src/internal/helpers.ts
var Helpers = class {
  static nospaces(input) {
    return input.replaceAll(/^\s*/gm, "").replaceAll(/\s*\n/g, "").replaceAll("?><", "?>\n<") || // C: xml definition on its own line
    "";
  }
  static cleanPemContents(pemContents) {
    const filteredLines = pemContents.split("\n").filter((line) => !line.startsWith("-----"));
    return filteredLines.map((line) => line.trim()).join("");
  }
  static htmlspecialchars(stringToReplace) {
    return stringToReplace.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
};

// src/internal/interacts_xml_trait.ts
var import_cfdi_core = require("@nodecfdi/cfdi-core");
var InteractsXmlTrait = class {
  readXmlDocument(source) {
    if (source === "") {
      throw new Error("Cannot load an xml with empty content");
    }
    return (0, import_cfdi_core.getParser)().parseFromString(source, "text/xml");
  }
  readXmlElement(source) {
    const document = this.readXmlDocument(source);
    const element = document.documentElement;
    return element;
  }
  findElement(element, ...names) {
    const first = names.shift();
    const current = first ? first.toLowerCase() : "";
    const children = element.childNodes;
    let index = 0;
    for (index; index < children.length; index += 1) {
      const child = children[index];
      if (child.nodeType === child.ELEMENT_NODE) {
        const localName = child.localName.toLowerCase();
        if (localName === current) {
          return names.length > 0 ? this.findElement(child, ...names) : child;
        }
      }
    }
    return void 0;
  }
  findContent(element, ...names) {
    const found = this.findElement(element, ...names);
    if (!found) {
      return "";
    }
    return this.extractElementContent(found);
  }
  extractElementContent(element) {
    const buffer = [];
    const children = element.childNodes;
    let index = 0;
    for (index; index < children.length; index += 1) {
      const child = children[index];
      if (child.nodeType === 3) {
        const c = child;
        if (c.textContent !== null) {
          buffer.push(c.textContent);
        }
      }
    }
    return buffer.join("");
  }
  findElements(element, ...names) {
    const last = names.pop();
    const current = last ? last.toLowerCase() : "";
    const temporaryElement = this.findElement(element, ...names);
    if (!temporaryElement) {
      return [];
    }
    const tempElement = temporaryElement;
    const found = [];
    const children = tempElement.childNodes;
    let index = 0;
    for (index; index < children.length; index += 1) {
      const child = children[index];
      if (child.nodeType === child.ELEMENT_NODE) {
        const localName = child.localName.toLowerCase();
        if (localName === current) {
          found.push(child);
        }
      }
    }
    return found;
  }
  findContents(element, ...names) {
    return this.findElements(element, ...names).map(
      (elementItem) => this.extractElementContent(elementItem)
    );
  }
  /**
   * Find the element determined by the chain of children and return the attributes as an
   * array using the attribute name as array key and attribute value as entry value.
   */
  findAtrributes(element, ...search) {
    const found = this.findElement(element, ...search);
    if (!found) {
      return {};
    }
    const attributes = /* @__PURE__ */ new Map();
    const elementAttributes = found.attributes;
    let index = 0;
    for (index; index < elementAttributes.length; index += 1) {
      attributes.set(
        elementAttributes[index].localName.toLowerCase(),
        elementAttributes[index].value
      );
    }
    return Object.fromEntries(attributes);
  }
};

// src/web_client/crequest.ts
var CRequest = class {
  _method;
  _uri;
  _body;
  _headers;
  constructor(method, uri, body, headers) {
    this._method = method;
    this._uri = uri;
    this._body = body;
    const map = new Map([...Object.entries(this.defaultHeaders()), ...Object.entries(headers)]);
    this._headers = Object.fromEntries(map);
  }
  getMethod() {
    return this._method;
  }
  getUri() {
    return this._uri;
  }
  getBody() {
    return this._body;
  }
  getHeaders() {
    return this._headers;
  }
  defaultHeaders() {
    return {
      "Content-type": 'text/xml; charset="utf-8"',
      "Accept": "text/xml",
      "Cache-Control": "no-cache"
    };
  }
  toJSON() {
    return {
      method: this._method,
      uri: this._uri,
      body: this._body,
      headers: this._headers
    };
  }
};

// src/web_client/exceptions/web_client_exception.ts
var WebClientException = class extends Error {
  _request;
  _response;
  _previous;
  constructor(message, request, response, previous) {
    super(message);
    this._request = request;
    this._response = response;
    this._previous = previous;
  }
  getRequest() {
    return this._request;
  }
  getResponse() {
    return this._response;
  }
  getPrevious() {
    return this._previous;
  }
};

// src/web_client/exceptions/http_client_error.ts
var HttpClientError = class extends WebClientException {
};

// src/web_client/exceptions/http_server_error.ts
var HttpServerError = class extends WebClientException {
};

// src/web_client/exceptions/soap_fault_error.ts
var SoapFaultError = class extends HttpClientError {
  _fault;
  constructor(request, response, fault, previous) {
    const message = `Fault: ${fault.getCode()} - ${fault.getMessage()}`;
    super(message, request, response, previous);
    this._fault = fault;
  }
  getFault() {
    return this._fault;
  }
};

// src/web_client/soap_fault_info.ts
var SoapFaultInfo = class {
  _code;
  _message;
  constructor(code, message) {
    this._code = code;
    this._message = message;
  }
  getCode() {
    return this._code;
  }
  getMessage() {
    return this._message;
  }
  toJSON() {
    return {
      code: this._code,
      message: this._message
    };
  }
};

// src/internal/soap_fault_info_extractor.ts
var SoapFaultInfoExtractor = class _SoapFaultInfoExtractor extends InteractsXmlTrait {
  static extract(source) {
    return new _SoapFaultInfoExtractor().obtainFault(source);
  }
  obtainFault(source) {
    let env;
    try {
      env = this.readXmlElement(source);
    } catch {
      return;
    }
    const code = (this.findElement(env, "body", "fault", "faultcode")?.textContent ?? "").trim();
    const message = (this.findElement(env, "body", "fault", "faultstring")?.textContent ?? "").trim();
    if (code === "" && message === "") {
      return;
    }
    return new SoapFaultInfo(code, message);
  }
};

// src/internal/service_consumer.ts
var ServiceConsumer = class _ServiceConsumer {
  static async consume(webClient, soapAction, uri, body, token) {
    return new _ServiceConsumer().execute(webClient, soapAction, uri, body, token);
  }
  async execute(webClient, soapAction, uri, body, token) {
    const headers = this.createHeaders(soapAction, token);
    const request = this.createRequest(uri, body, headers);
    let exception;
    let response;
    try {
      response = await this.runRequest(webClient, request);
    } catch (error) {
      const webError = error;
      exception = webError;
      response = webError.getResponse();
    }
    this.checkErrors(request, response, exception);
    return response.getBody();
  }
  createRequest(uri, body, headers) {
    return new CRequest("POST", uri, body, headers);
  }
  createHeaders(soapAction, token) {
    const headers = /* @__PURE__ */ new Map();
    headers.set("SOAPAction", soapAction);
    if (token) {
      headers.set("Authorization", `WRAP access_token="${token.getValue()}"`);
    }
    return Object.fromEntries(headers);
  }
  async runRequest(webClient, request) {
    webClient.fireRequest(request);
    let response;
    try {
      response = await webClient.call(request);
    } catch (error) {
      const webError = error;
      webClient.fireResponse(webError.getResponse());
      throw webError;
    }
    webClient.fireResponse(response);
    return response;
  }
  checkErrors(request, response, exception) {
    const fault = SoapFaultInfoExtractor.extract(response.getBody());
    if (fault) {
      throw new SoapFaultError(request, response, fault, exception);
    }
    if (response.statusCodeIsClientError()) {
      const message = `Unexpected client error status code ${response.getStatusCode()}`;
      throw new HttpClientError(message, request, response, exception);
    }
    if (response.statusCodeIsServerError()) {
      const message = `Unexpected server error status code ${response.getStatusCode()}`;
      throw new HttpServerError(message, request, response, exception);
    }
    if (response.isEmpty()) {
      throw new HttpServerError(
        "Unexpected empty response from server",
        request,
        response,
        exception
      );
    }
  }
};

// src/package_reader/internal/file_filters/cfdi_file_filter.ts
var CfdiFileFilter = class _CfdiFileFilter {
  static obtainUuidFromXmlCfdi(xmlContent) {
    const pattern = /:Complemento.*?:TimbreFiscalDigital.*?UUID="(?<uuid>[\dA-Za-z-]{36})"/s;
    const found = pattern.exec(xmlContent);
    if (found?.groups?.uuid) {
      return found.groups.uuid.toLowerCase();
    }
    return "";
  }
  filterFilename(filename) {
    return /^[^/\\]+\.xml/i.test(filename);
  }
  filterContents(contents) {
    return _CfdiFileFilter.obtainUuidFromXmlCfdi(contents) !== "";
  }
};

// src/package_reader/internal/filtered_package_reader.ts
var import_node_crypto = require("crypto");
var import_promises = require("fs/promises");
var import_node_os = __toESM(require("os"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_jszip = __toESM(require("jszip"), 1);

// src/package_reader/exceptions/package_reader_exception.ts
var PackageReaderException = class extends Error {
};

// src/package_reader/exceptions/create_temporary_file_zip_exception.ts
var CreateTemporaryZipFileException = class _CreateTemporaryZipFileException extends PackageReaderException {
  _previous;
  constructor(message, previous) {
    super(message);
    this._previous = previous;
  }
  static create(message, previous) {
    const messageToSend = previous && previous.message !== "" ? `${message} : ${previous.message}` : message;
    return new _CreateTemporaryZipFileException(messageToSend, previous);
  }
  getPrevious() {
    return this._previous;
  }
};

// src/package_reader/exceptions/open_zip_file_exception.ts
var OpenZipFileException = class _OpenZipFileException extends PackageReaderException {
  _filename;
  _previous;
  _code;
  constructor(message, code, filename, previous) {
    super(message);
    this._filename = filename;
    this._previous = previous;
    this._code = code;
  }
  static create(filename, code, previous) {
    const messageToSend = previous && previous.message !== "" ? `Unable to open Zip file ${filename}. previous ${previous.message}` : `Unable to open Zip file ${filename}`;
    return new _OpenZipFileException(messageToSend, code, filename, previous);
  }
  getFileName() {
    return this._filename;
  }
  getCode() {
    return this._code;
  }
  getPrevious() {
    return this._previous;
  }
};

// src/package_reader/internal/file_filters/null_file_filter.ts
var NullFileFilter = class {
  filterFilename(_filename) {
    return true;
  }
  filterContents(_contents) {
    return true;
  }
};

// src/package_reader/internal/filtered_package_reader.ts
var FilteredPackageReader = class _FilteredPackageReader {
  _filename;
  _archive;
  _removeOnDestruct = false;
  _filter;
  constructor(filename, archive) {
    this._filename = filename;
    this._archive = archive;
  }
  static async createFromFile(filename) {
    let archive;
    let data;
    try {
      data = await (0, import_promises.readFile)(filename);
    } catch {
      throw OpenZipFileException.create(filename, -1);
    }
    try {
      archive = await import_jszip.default.loadAsync(data);
    } catch {
      throw OpenZipFileException.create(filename, -1);
    }
    return new _FilteredPackageReader(filename, archive);
  }
  static async createFromContents(contents) {
    const tmpdir = await (0, import_promises.realpath)(import_node_os.default.tmpdir());
    const tmpfile = import_node_path.default.join(tmpdir, `${(0, import_node_crypto.randomUUID)()}.zip`);
    try {
      await (0, import_promises.writeFile)(tmpfile, "");
    } catch (error) {
      throw CreateTemporaryZipFileException.create(
        "Cannot create a temporary file",
        error
      );
    }
    try {
      await (0, import_promises.writeFile)(tmpfile, contents, { encoding: "binary" });
    } catch (error) {
      throw CreateTemporaryZipFileException.create(
        "Cannot store contents on temporary file",
        error
      );
    }
    let cpackage;
    try {
      cpackage = await _FilteredPackageReader.createFromFile(tmpfile);
    } catch (error) {
      await (0, import_promises.unlink)(tmpfile);
      throw error;
    }
    cpackage._removeOnDestruct = true;
    return cpackage;
  }
  async destruct() {
    if (this._removeOnDestruct) {
      await (0, import_promises.unlink)(this._filename);
    }
  }
  async *fileContents() {
    const archive = this.getArchive();
    const filter = this.getFilter();
    const entries = Object.keys(archive.files).map((name) => archive.files[name].name);
    let contents;
    for await (const entry of entries) {
      if (!filter.filterFilename(entry)) {
        continue;
      }
      contents = await archive.file(entry)?.async("text");
      if (contents === void 0 || !filter.filterContents(contents)) {
        continue;
      }
      yield (/* @__PURE__ */ new Map()).set(entry, contents || "");
    }
  }
  async count() {
    let count = 0;
    for await (const [,] of this.fileContents()) {
      count += 1;
    }
    return count;
  }
  getFilename() {
    return this._filename;
  }
  getArchive() {
    return this._archive;
  }
  getFilter() {
    return this._filter;
  }
  setFilter(filter) {
    this._filter = filter ?? new NullFileFilter();
  }
  changeFilter(filter) {
    const previous = this.getFilter();
    this.setFilter(filter);
    return previous;
  }
  async jsonSerialize() {
    let files = {};
    for await (const item of this.fileContents()) {
      for (const [key, value] of item) {
        files = { ...files, [key]: value };
      }
    }
    return {
      source: this.getFilename(),
      files
    };
  }
};

// src/package_reader/cfdi_package_reader.ts
var CfdiPackageReader = class _CfdiPackageReader {
  constructor(_packageReader) {
    this._packageReader = _packageReader;
  }
  static async createFromFile(filename) {
    const packageReader = await FilteredPackageReader.createFromFile(filename);
    packageReader.setFilter(new CfdiFileFilter());
    return new _CfdiPackageReader(packageReader);
  }
  static async createFromContents(contents) {
    const packageReader = await FilteredPackageReader.createFromContents(contents);
    packageReader.setFilter(new CfdiFileFilter());
    await packageReader.destruct();
    return new _CfdiPackageReader(packageReader);
  }
  async *cfdis() {
    for await (const content of this._packageReader.fileContents()) {
      let data = "";
      for (const item of content) {
        data = item[1];
      }
      yield (/* @__PURE__ */ new Map()).set(CfdiFileFilter.obtainUuidFromXmlCfdi(data), data);
    }
  }
  getFilename() {
    return this._packageReader.getFilename();
  }
  async count() {
    let count = 0;
    for await (const [,] of this.fileContents()) {
      count += 1;
    }
    return count;
  }
  async *fileContents() {
    yield* this._packageReader.fileContents();
  }
  async jsonSerialize() {
    const filtered = await this._packageReader.jsonSerialize();
    let cfdis = {};
    for await (const item of this.cfdis()) {
      for (const [key, value] of item) {
        cfdis = { ...cfdis, [key]: value };
      }
    }
    return {
      source: filtered.source,
      files: filtered.files,
      cfdis
    };
  }
  async cfdisToArray() {
    const cfdis = [];
    for await (const item of this.cfdis()) {
      for (const [uuid, content] of item) {
        cfdis.push({ uuid, content });
      }
    }
    return cfdis;
  }
  async fileContentsToArray() {
    const contents = [];
    for await (const item of this.fileContents()) {
      for (const [name, content] of item) {
        contents.push({ name, content });
      }
    }
    return contents;
  }
};

// src/package_reader/internal/csv_reader.ts
var import_node_crypto2 = require("crypto");
var import_node_fs = require("fs");
var import_node_os2 = __toESM(require("os"), 1);
var import_node_path2 = __toESM(require("path"), 1);
var readline = __toESM(require("readline"), 1);
var CsvReader = class _CsvReader {
  constructor(_iterator) {
    this._iterator = _iterator;
  }
  static createIteratorFromContents(contents) {
    const tmpdir = (0, import_node_fs.realpathSync)(import_node_os2.default.tmpdir());
    const filePath = import_node_path2.default.join(tmpdir, `${(0, import_node_crypto2.randomUUID)()}.csv`);
    (0, import_node_fs.writeFileSync)(filePath, contents);
    const iterator = readline.createInterface({
      input: (0, import_node_fs.createReadStream)(filePath),
      crlfDelay: Number.POSITIVE_INFINITY
    });
    return iterator;
  }
  static createFromContents(contents) {
    return new _CsvReader(_CsvReader.createIteratorFromContents(contents));
  }
  async *records() {
    const headers = [];
    for await (const line of this._iterator) {
      const clean = line.split(/[|~]/).map((item) => item.trim());
      if (clean.length === 0 || JSON.stringify(clean) === '[""]') {
        continue;
      }
      if (headers.length === 0) {
        headers.push(...clean);
        continue;
      }
      yield this.combine(headers, clean);
    }
  }
  /**
   * Like array.concat but complement missing values or missing keys (#extra-01, #extra-02, etc...)
   */
  combine(keys, values) {
    const countValues = values.length;
    const countKeys = keys.length;
    let newValues = values;
    if (countKeys > countValues) {
      const emptyArray = Array.from({ length: countKeys - countValues });
      newValues = [...values, ...emptyArray.fill("")];
    }
    if (countValues > countKeys) {
      for (let i = 1; i <= countValues - countKeys; i += 1) {
        const string_ = i.toString().padStart(2, "0");
        keys.push(`#extra-${string_}`);
      }
    }
    const map = /* @__PURE__ */ new Map();
    for (const [index, value] of newValues.entries()) {
      map.set(keys[index], value);
    }
    return Object.fromEntries(map);
  }
};

// src/package_reader/internal/file_filters/metadata_file_filter.ts
var MetadataFileFilter = class {
  filterFilename(filename) {
    return /^[^/\\]+\.txt/i.test(filename);
  }
  filterContents(contents) {
    return contents.startsWith("Uuid~RfcEmisor~");
  }
};

// src/package_reader/internal/file_filters/third_parties_file_filter.ts
var ThirdPartiesFileFilter = class {
  filterFilename(filename) {
    return /^[^/\\]+_tercero\.txt/i.test(filename);
  }
  filterContents(contents) {
    return contents.startsWith("Uuid~RfcACuentaTerceros~NombreACuentaTerceros");
  }
};

// src/package_reader/metadata_item.ts
var MetadataItem = class {
  _data;
  constructor(data) {
    this._data = Object.entries(data).map(([key, value]) => ({
      key,
      value
    }));
  }
  get(key) {
    return this._data.find((item) => item.key === key)?.value ?? "";
  }
  /**
   *
   * returns all keys and values in a record form.
   */
  all() {
    return Object.fromEntries(this._data.map((current) => [current.key, current.value]));
  }
  [Symbol.iterator]() {
    return this._data[Symbol.iterator]();
  }
};

// src/package_reader/internal/metadata_preprocessor.ts
var MetadataPreprocessor = class {
  /** The data to process */
  _contents;
  constructor(contents) {
    this._contents = contents;
  }
  CONTROL_CR = "\r";
  CONTROL_LF = "\n";
  CONTROL_CRLF = "\r\n";
  getContents() {
    return this._contents;
  }
  fix() {
    this.fixEolCrLf();
  }
  fixEolCrLf() {
    const firstLineFeedPosition = this._contents.indexOf(this.CONTROL_LF);
    let eolIsCrLf;
    if (firstLineFeedPosition === -1) {
      eolIsCrLf = false;
    } else {
      eolIsCrLf = firstLineFeedPosition > 0 ? this._contents.slice(firstLineFeedPosition - 1, firstLineFeedPosition) === this.CONTROL_CR : this._contents.lastIndexOf(this.CONTROL_CR) === -1;
    }
    if (!eolIsCrLf) {
      return;
    }
    const lines = this._contents.split(this.CONTROL_CRLF);
    this._contents = lines.map((line) => line.replaceAll(new RegExp(/\n/, "g"), "")).join(this.CONTROL_LF);
  }
};

// src/package_reader/internal/third_parties_extractor.ts
var ThirdPartiesExtractor = class _ThirdPartiesExtractor {
  constructor(_csvReader) {
    this._csvReader = _csvReader;
  }
  static async createFromPackageReader(packageReader) {
    if (!(packageReader instanceof FilteredPackageReader)) {
      throw new TypeError("PackageReader parameter must be a FilteredPackageReader");
    }
    const previousFilter = packageReader.changeFilter(new ThirdPartiesFileFilter());
    let contents = "";
    for await (const fileContents of packageReader.fileContents()) {
      for (const item of fileContents) {
        contents = item[1];
      }
      break;
    }
    packageReader.setFilter(previousFilter);
    return new _ThirdPartiesExtractor(CsvReader.createFromContents(contents));
  }
  async *eachRecord() {
    let uuid;
    for await (const data of this._csvReader.records()) {
      uuid = data.Uuid.toUpperCase();
      if (uuid === "") {
        continue;
      }
      const value = {
        RfcACuentaTerceros: data.RfcACuentaTerceros,
        NombreACuentaTerceros: data.NombreACuentaTerceros
      };
      yield (/* @__PURE__ */ new Map()).set(uuid, value);
    }
  }
};

// src/package_reader/internal/third_parties_records.ts
var ThirdPartiesRecords = class _ThirdPartiesRecords {
  constructor(_records) {
    this._records = _records;
  }
  static createEmpty() {
    return new _ThirdPartiesRecords({});
  }
  static async createFromPackageReader(packageReader) {
    const thirdPartiesBuilder = await ThirdPartiesExtractor.createFromPackageReader(packageReader);
    const records = {};
    for await (const iterator of thirdPartiesBuilder.eachRecord()) {
      for (const [key, value] of iterator) {
        records[_ThirdPartiesRecords.formatUuid(key)] = value;
      }
    }
    return new _ThirdPartiesRecords(records);
  }
  static formatUuid(uuid) {
    return uuid.toLowerCase();
  }
  addToData(data) {
    const uuid = data.Uuid ?? "";
    const values = this.getDataFromUuid(uuid);
    return { ...data, ...values };
  }
  getDataFromUuid(uuid) {
    const defaultValue = {
      RfcACuentaTerceros: "",
      NombreACuentaTerceros: ""
    };
    return this._records[_ThirdPartiesRecords.formatUuid(uuid)] ?? defaultValue;
  }
};

// src/package_reader/internal/metadata_content.ts
var MetadataContent = class _MetadataContent {
  /**
   * The iterator will be used in a foreach loop to create MetadataItems
   * The first iteration must contain an array of header names that will be renames to lower case first letter
   * The next iterations must contain an array with data
   */
  constructor(_csvReader, _thirdParties) {
    this._csvReader = _csvReader;
    this._thirdParties = _thirdParties;
  }
  /**
   * This method fix the content and create a SplTempFileObject to store the information
   */
  static createFromContents(contents, thirdParties) {
    const defaultThirdParties = thirdParties ?? ThirdPartiesRecords.createEmpty();
    const preprocessor = new MetadataPreprocessor(contents);
    preprocessor.fix();
    const csvReader = CsvReader.createFromContents(preprocessor.getContents());
    return new _MetadataContent(csvReader, defaultThirdParties);
  }
  async *eachItem() {
    for await (const data of this._csvReader.records()) {
      yield new MetadataItem(
        this.changeArrayKeysFirstLetterLoweCase(this._thirdParties.addToData(data))
      );
    }
  }
  changeArrayKeysFirstLetterLoweCase(data) {
    for (const [key, value] of Object.entries(data)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      data[newKey] = value;
      if (key !== newKey) {
        delete data[key];
      }
    }
    return data;
  }
};

// src/package_reader/metadata_package_reader.ts
var MetadataPackageReader = class _MetadataPackageReader {
  constructor(_packageReader, _thirdParties) {
    this._packageReader = _packageReader;
    this._thirdParties = _thirdParties;
  }
  static async createFromFile(fileName) {
    const packageReader = await FilteredPackageReader.createFromFile(fileName);
    packageReader.setFilter(new MetadataFileFilter());
    const thirdParties = await ThirdPartiesRecords.createFromPackageReader(packageReader);
    return new _MetadataPackageReader(packageReader, thirdParties);
  }
  static async createFromContents(contents) {
    const packageReader = await FilteredPackageReader.createFromContents(contents);
    packageReader.setFilter(new MetadataFileFilter());
    await packageReader.destruct();
    const thirdParties = await ThirdPartiesRecords.createFromPackageReader(packageReader);
    return new _MetadataPackageReader(packageReader, thirdParties);
  }
  async getThirdParties() {
    this._thirdParties = this._thirdParties ?? await ThirdPartiesRecords.createFromPackageReader(this._packageReader);
    return this._thirdParties;
  }
  async *metadata() {
    let reader;
    for await (const content of this._packageReader.fileContents()) {
      const parties = await this.getThirdParties();
      for await (const [, value] of content) {
        reader = MetadataContent.createFromContents(value, parties);
        for await (const item of reader.eachItem()) {
          yield item;
        }
      }
    }
  }
  getFilename() {
    return this._packageReader.getFilename();
  }
  async count() {
    let count = 0;
    for await (const [,] of this.fileContents()) {
      count += 1;
    }
    return count;
  }
  async *fileContents() {
    yield* this._packageReader.fileContents();
  }
  async jsonSerialize() {
    const filtered = await this._packageReader.jsonSerialize();
    let metadata = {};
    for await (const iterator of this.metadata()) {
      metadata = { ...metadata, [iterator.get("uuid")]: iterator.all() };
    }
    return {
      source: filtered.source,
      files: filtered.files,
      metadata
    };
  }
  async metadataToArray() {
    const content = [];
    for await (const iterator of this.metadata()) {
      content.push(iterator);
    }
    return content;
  }
};

// src/request_builder/fiel_request_builder/fiel.ts
var import_credentials = require("@nodecfdi/credentials");
var Fiel = class _Fiel {
  constructor(_credential) {
    this._credential = _credential;
  }
  /**
   * Create a Fiel based on certificate and private key contents
   */
  static create(certificateContents, privateKeyContents, passPhrase) {
    const credential = import_credentials.Credential.create(certificateContents, privateKeyContents, passPhrase);
    return new _Fiel(credential);
  }
  sign(toSign, algorithm) {
    return this._credential.sign(toSign, algorithm);
  }
  isValid() {
    if (!this._credential.certificate().satType().isFiel()) {
      return false;
    }
    return this._credential.certificate().validOn();
  }
  getCertificatePemContents() {
    return this._credential.certificate().pem();
  }
  getRfc() {
    return this._credential.rfc();
  }
  getCertificateSerial() {
    return this._credential.certificate().serialNumber().decimal();
  }
  /** missing function this.credential.certificate().issuerAsRfc4514() */
  getCertificateIssuerName() {
    return this._credential.certificate().issuerAsRfc4514();
  }
};

// src/request_builder/fiel_request_builder/fiel_request_builder.ts
var import_node_crypto3 = require("crypto");

// src/shared/abstract_rfc_filter.ts
var import_rfc = require("@nodecfdi/rfc");
var AbstractRfcFilter = class _AbstractRfcFilter {
  constructor(_value) {
    this._value = _value;
  }
  static create(value) {
    try {
      return new _AbstractRfcFilter(import_rfc.Rfc.parse(value));
    } catch {
      throw new Error("RFC is invalid");
    }
  }
  static empty() {
    return new _AbstractRfcFilter();
  }
  static check(value) {
    try {
      _AbstractRfcFilter.create(value);
      return true;
    } catch {
      return false;
    }
  }
  isEmpty() {
    return this._value === void 0;
  }
  getValue() {
    if (this._value === void 0) {
      return "";
    }
    return this._value.getRfc();
  }
  toJSON() {
    return this._value?.toJSON();
  }
};

// src/shared/rfc_match.ts
var RfcMatch = class extends AbstractRfcFilter {
};

// src/shared/rfc_matches.ts
var RfcMatches = class _RfcMatches {
  _items;
  _count;
  constructor(...items) {
    this._items = items;
    this._count = items.length;
  }
  static create(...items) {
    const map = /* @__PURE__ */ new Map();
    const values = [];
    for (const item of items) {
      const key = item.getValue();
      if (!item.isEmpty() && !map.get(key)) {
        map.set(item.getValue(), item);
        values.push(item);
      }
    }
    return new _RfcMatches(...values);
  }
  static createFromValues(...values) {
    const valuesRfc = values.map(
      (value) => value === "" ? RfcMatch.empty() : RfcMatch.create(value)
    );
    return _RfcMatches.create(...valuesRfc);
  }
  isEmpty() {
    return this._count === 0;
  }
  getFirst() {
    return this._items[0] ?? RfcMatch.empty();
  }
  count() {
    return this._count;
  }
  [Symbol.iterator]() {
    return this._items;
  }
  itemsToArray() {
    const values = [];
    for (const iterator of this._items) {
      values.push(iterator);
    }
    return values;
  }
  toJSON() {
    return this._items;
  }
};

// src/request_builder/fiel_request_builder/fiel_request_builder.ts
var FielRequestBuilder = class _FielRequestBuilder {
  constructor(_fiel) {
    this._fiel = _fiel;
  }
  static createXmlSecurityToken() {
    const md5 = (0, import_node_crypto3.createHash)("md5").update((0, import_node_crypto3.randomUUID)()).digest("hex");
    return `uuid-${md5.slice(0, 8)}-${md5.slice(4, 8)}-${md5.slice(4, 12)}-${md5.slice(4, 16)}-${md5.slice(20)}-1`;
  }
  getFiel() {
    return this._fiel;
  }
  authorization(created, expires, securityTokenId = "") {
    const uuid = securityTokenId || _FielRequestBuilder.createXmlSecurityToken();
    const certificate = Helpers.cleanPemContents(this.getFiel().getCertificatePemContents());
    const keyInfoData = `
            <KeyInfo>
                <o:SecurityTokenReference>
                    <o:Reference URI="#${uuid}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
                </o:SecurityTokenReference>
            </KeyInfo>
        `;
    const toDigestXml = `
            <u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0">
                <u:Created>${created.formatSat()}</u:Created>
                <u:Expires>${expires.formatSat()}</u:Expires>
            </u:Timestamp>
        `;
    const signatureData = this.createSignature(toDigestXml, "#_0", keyInfoData);
    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                <s:Header>
                    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">
                        <u:Timestamp u:Id="_0">
                            <u:Created>${created.formatSat()}</u:Created>
                            <u:Expires>${expires.formatSat()}</u:Expires>
                        </u:Timestamp>
                        <o:BinarySecurityToken u:Id="${uuid}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
                            ${certificate}
                        </o:BinarySecurityToken>
                        ${signatureData}
                    </o:Security>
                </s:Header>
                <s:Body>
                    <Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/>
                </s:Body>
            </s:Envelope>
        `;
    return Helpers.nospaces(xml);
  }
  query(queryParameters) {
    const queryByUuid = !queryParameters.getUuid().isEmpty();
    let xmlRfcReceived = "";
    const requestType = queryParameters.getRequestType().getQueryAttributeValue(queryParameters.getServiceType());
    const rfcSigner = this.getFiel().getRfc().toUpperCase();
    const solicitudAttributes = /* @__PURE__ */ new Map();
    solicitudAttributes.set("RfcSolicitante", rfcSigner);
    solicitudAttributes.set("TipoSolicitud", requestType);
    if (queryByUuid) {
      solicitudAttributes.set("Folio", queryParameters.getUuid().getValue());
    } else {
      const start = queryParameters.getPeriod().getStart().format("yyyy-MM-dd'T'HH:mm:ss");
      const end = queryParameters.getPeriod().getEnd().format("yyyy-MM-dd'T'HH:mm:ss");
      let rfcIssuer;
      let rfcReceivers;
      if (queryParameters.getDownloadType().isTypeOf("issued")) {
        rfcIssuer = rfcSigner;
        rfcReceivers = queryParameters.getRfcMatches();
      } else {
        rfcIssuer = queryParameters.getRfcMatches().getFirst().getValue();
        rfcReceivers = RfcMatches.createFromValues(rfcSigner);
      }
      solicitudAttributes.set("FechaInicial", start);
      solicitudAttributes.set("FechaFinal", end);
      solicitudAttributes.set("RfcEmisor", rfcIssuer);
      solicitudAttributes.set("TipoComprobante", queryParameters.getDocumentType().value());
      solicitudAttributes.set("EstadoComprobante", queryParameters.getDocumentStatus().value());
      solicitudAttributes.set("RfcACuentaTerceros", queryParameters.getRfcOnBehalf().getValue());
      solicitudAttributes.set("Complemento", queryParameters.getComplement().value());
      if (!rfcReceivers.isEmpty()) {
        xmlRfcReceived = rfcReceivers.itemsToArray().map(
          (rfcMatch) => `<des:RfcReceptor>${this.parseXml(rfcMatch.getValue())}</des:RfcReceptor>`
        ).join("");
        xmlRfcReceived = `<des:RfcReceptores>${xmlRfcReceived}</des:RfcReceptores>`;
      }
    }
    const cleanedSolicitudAttributes = /* @__PURE__ */ new Map();
    for (const [key, value] of solicitudAttributes) {
      if (value !== "") {
        cleanedSolicitudAttributes.set(key, value);
      }
    }
    const sortedValues = new Map(
      [...cleanedSolicitudAttributes].sort((a, b) => String(a[0]).localeCompare(b[0]))
    );
    const solicitudAttributesAsText = [...sortedValues].map(
      ([name, value]) => `${this.parseXml(name)}="${this.parseXml(value)}"`
    ).join(" ");
    const toDigestXml = `
            <des:SolicitaDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud ${solicitudAttributesAsText}>
                    ${xmlRfcReceived}
                </des:solicitud>
            </des:SolicitaDescarga>
           `;
    const signatureData = this.createSignature(toDigestXml);
    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:SolicitaDescarga>
                        <des:solicitud ${solicitudAttributesAsText}>
                            ${xmlRfcReceived}
                            ${signatureData}
                        </des:solicitud>
                    </des:SolicitaDescarga>
                </s:Body>
            </s:Envelope>
        `;
    return Helpers.nospaces(xml);
  }
  verify(requestId) {
    const xmlRequestId = this.parseXml(requestId);
    const xmlRfc = this.parseXml(this.getFiel().getRfc());
    const toDigestXml = `
            <des:VerificaSolicitudDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:solicitud IdSolicitud="${xmlRequestId}" RfcSolicitante="${xmlRfc}"></des:solicitud>
            </des:VerificaSolicitudDescarga>
        `;
    const signatureData = this.createSignature(toDigestXml);
    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:VerificaSolicitudDescarga>
                        <des:solicitud IdSolicitud="${xmlRequestId}" RfcSolicitante="${xmlRfc}">
                            ${signatureData}
                        </des:solicitud>
                    </des:VerificaSolicitudDescarga>
                </s:Body>
            </s:Envelope>
        `;
    return Helpers.nospaces(xml);
  }
  download(packageId) {
    const xmlPackageId = this.parseXml(packageId);
    const xmlRfcOwner = this.parseXml(this.getFiel().getRfc());
    const toDigestXml = `
            <des:PeticionDescargaMasivaTercerosEntrada xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">
                <des:peticionDescarga IdPaquete="${xmlPackageId}" RfcSolicitante="${xmlRfcOwner}"></des:peticionDescarga>
            </des:PeticionDescargaMasivaTercerosEntrada>
        `;
    const signatureData = this.createSignature(toDigestXml);
    const xml = `
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
                <s:Header/>
                <s:Body>
                    <des:PeticionDescargaMasivaTercerosEntrada>
                        <des:peticionDescarga IdPaquete="${xmlPackageId}" RfcSolicitante="${xmlRfcOwner}">
                            ${signatureData}
                        </des:peticionDescarga>
                    </des:PeticionDescargaMasivaTercerosEntrada>
                </s:Body>
            </s:Envelope>
        `;
    return Helpers.nospaces(xml);
  }
  createSignature(toDigest, signedInfoUri = "", keyInfo = "") {
    const cleanToDigest = Helpers.nospaces(toDigest);
    const digested = (0, import_node_crypto3.createHash)("sha1").update(cleanToDigest).digest("base64");
    let signedInfo = this.createSignedInfoCanonicalExclusive(digested, signedInfoUri);
    const signatureValue = Buffer.from(this.getFiel().sign(signedInfo, "sha1"), "binary").toString(
      "base64"
    );
    signedInfo = signedInfo.replace(
      '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">',
      "<SignedInfo>"
    );
    let newKeyInfo = keyInfo;
    if (newKeyInfo === "") {
      newKeyInfo = this.createKeyInfoData();
    }
    return `
            <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
                ${signedInfo}
                <SignatureValue>${signatureValue}</SignatureValue>
                ${newKeyInfo}
            </Signature>
        `;
  }
  createSignedInfoCanonicalExclusive(digested, uri = "") {
    const xml = `
            <SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
                <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod>
                <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod>
                <Reference URI="${uri}">
                    <Transforms>
                        <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform>
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod>
                    <DigestValue>${digested}</DigestValue>
                </Reference>
            </SignedInfo>
        `;
    return Helpers.nospaces(xml);
  }
  createKeyInfoData() {
    const fiel = this.getFiel();
    const certificate = Helpers.cleanPemContents(fiel.getCertificatePemContents());
    const serial = fiel.getCertificateSerial();
    const issuerName = this.parseXml(fiel.getCertificateIssuerName());
    return `
            <KeyInfo>
                <X509Data>
                    <X509IssuerSerial>
                        <X509IssuerName>${issuerName}</X509IssuerName>
                        <X509SerialNumber>${serial}</X509SerialNumber>
                    </X509IssuerSerial>
                    <X509Certificate>${certificate}</X509Certificate>
                </X509Data>
            </KeyInfo>
        `;
  }
  parseXml(text) {
    return Helpers.htmlspecialchars(text);
  }
};

// src/request_builder/request_builder_exception.ts
var RequestBuilderException = class extends Error {
};

// src/shared/date_time.ts
var import_luxon = require("luxon");
var DateTime = class _DateTime {
  _value;
  _defaultTimeZone;
  /**
   * DateTime constructor.
   *
   * If value is an integer is used as a timestamp, if is a string is evaluated
   * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
   *
   * @throws Error if unable to create a DateTime
   */
  constructor(value, defaultTimeZone) {
    let newValue = value ?? "now";
    const originalValue = newValue;
    this._defaultTimeZone = defaultTimeZone ?? import_luxon.DateTime.now().zone.name;
    if (typeof newValue === "number") {
      this._value = import_luxon.DateTime.fromSeconds(newValue, {
        zone: this._defaultTimeZone
      });
      if (!this._value.isValid) {
        throw new Error(`Unable to create a Datetime("${originalValue}")`);
      }
      return;
    }
    if (typeof newValue === "string") {
      newValue = this.castStringToDateTimeImmutable(newValue, originalValue);
    }
    if (!(newValue instanceof import_luxon.DateTime) || !newValue.isValid) {
      throw new Error("Unable to create a Datetime");
    }
    this._value = newValue;
  }
  /**
   * Create a DateTime instance
   *
   * If value is an integer is used as a timestamp, if is a string is evaluated
   * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
   */
  static create(value, defaultTimeZone) {
    return new _DateTime(value, defaultTimeZone);
  }
  static now() {
    return new _DateTime();
  }
  formatSat() {
    return this.formatTimeZone("UTC");
  }
  format(format, timezone = "") {
    let clonedTimeZone = timezone;
    if (clonedTimeZone === "") {
      clonedTimeZone = this._defaultTimeZone;
    }
    this._value = this._value.setZone(clonedTimeZone);
    return this._value.toFormat(format);
  }
  formateDefaultTimeZone() {
    return this.formatTimeZone(this._defaultTimeZone);
  }
  formatTimeZone(timezone) {
    return this._value.setZone(timezone).toISO() ?? "";
  }
  /**
   * add or sub in given DurationLike
   *
   */
  modify(time) {
    const temporary = this._value;
    return new _DateTime(temporary.plus(time));
  }
  compareTo(otherDate) {
    return this.formatSat().toString().localeCompare(otherDate.formatSat().toString());
  }
  equalsTo(expectedExpires) {
    return this.formatSat() === expectedExpires.formatSat();
  }
  toJSON() {
    return this._value.toSeconds();
  }
  castStringToDateTimeImmutable(value, originalValue) {
    if (value === "now") {
      return import_luxon.DateTime.fromISO(import_luxon.DateTime.now().toISO(), {
        zone: this._defaultTimeZone
      });
    }
    const temporary = import_luxon.DateTime.fromSQL(value, {
      zone: this._defaultTimeZone
    });
    const newValue = temporary.isValid ? temporary : import_luxon.DateTime.fromISO(value);
    if (!newValue.isValid) {
      throw new Error(`Unable to create a Datetime("${originalValue}")`);
    }
    return newValue;
  }
};

// src/shared/token.ts
var Token = class {
  constructor(created, _expires, _value) {
    this._expires = _expires;
    this._value = _value;
    if (_expires.compareTo(created) < 0) {
      throw new Error("Cannot create a token with expiration lower than creation");
    }
    this._created = created;
  }
  _created;
  getCreated() {
    return this._created;
  }
  getExpires() {
    return this._expires;
  }
  getValue() {
    return this._value;
  }
  /**
   * A token is empty if does not contains an internal value
   */
  isValueEmpty() {
    return this._value === "";
  }
  /**
   * A token is expired if the expiration date is greater or equal to current time
   */
  isExpired() {
    return this._expires.compareTo(DateTime.now()) < 0;
  }
  /**
   * A token is valid if contains a value and is not expired
   */
  isValid() {
    return !(this.isValueEmpty() || this.isExpired());
  }
  toJSON() {
    return {
      created: this._created,
      expires: this._expires,
      value: this._value
    };
  }
};

// src/services/authenticate/authenticate_translator.ts
var AuthenticateTranslator = class extends InteractsXmlTrait {
  createTokenFromSoapResponse(content) {
    const env = this.readXmlElement(content);
    let timeContent = this.findContent(env, "header", "security", "timestamp", "created");
    const created = DateTime.create(timeContent === "" ? 0 : timeContent);
    timeContent = this.findContent(env, "header", "security", "timestamp", "expires");
    const expires = DateTime.create(timeContent === "" ? 0 : timeContent);
    const value = this.findContent(env, "body", "autenticaResponse", "autenticaResult");
    return new Token(created, expires, value);
  }
  createSoapRequest(requestBuilder) {
    const since = DateTime.now();
    const until = since.modify({ minutes: 5 });
    return this.createSoapRequestWithData(requestBuilder, since, until);
  }
  createSoapRequestWithData(requestBuilder, since, until, securityToken = "") {
    return requestBuilder.authorization(since, until, securityToken);
  }
};

// src/shared/status_code.ts
var StatusCode = class {
  constructor(_code, _message) {
    this._code = _code;
    this._message = _message;
  }
  /**
   * Contains the value of "CodEstatus"
   */
  getCode() {
    return this._code;
  }
  /**
   * Contains the value of "Mensaje"
   */
  getMessage() {
    return this._message;
  }
  /**
   * Return true when "CodEstatus" is success
   * The only success code is "5000: Solicitud recibida con éxito"
   */
  isAccepted() {
    return this._code === 5e3;
  }
  toJSON() {
    return {
      code: this._code,
      message: this._message
    };
  }
};

// src/services/download/download_result.ts
var DownloadResult = class {
  constructor(_status, _packageContent) {
    this._status = _status;
    this._packageContent = _packageContent;
    this._packageSize = _packageContent.length;
  }
  _packageSize;
  /**
   * Status of the download call
   */
  getStatus() {
    return this._status;
  }
  /**
   * If available, contains the package contents
   */
  getPackageContent() {
    return this._packageContent;
  }
  /**
   * If available, contains the package contents length in bytesF
   */
  getPackageSize() {
    return this._packageSize;
  }
  toJSON() {
    return {
      status: this._status,
      length: this._packageSize
    };
  }
};

// src/services/download/download_translator.ts
var DownloadTranslator = class extends InteractsXmlTrait {
  createDownloadResultFromSoapResponse(content) {
    const env = this.readXmlElement(content);
    const values = this.findAtrributes(env, "header", "respuesta");
    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const cpackage = this.findContent(
      env,
      "body",
      "RespuestaDescargaMasivaTercerosSalida",
      "Paquete"
    );
    return new DownloadResult(status, Buffer.from(cpackage).toString() || "");
  }
  createSoapRequest(requestBuilder, packageId) {
    return requestBuilder.download(packageId);
  }
};

// src/services/query/query_result.ts
var QueryResult = class {
  _status;
  _requestId;
  constructor(statusCode, requestId) {
    this._status = statusCode;
    this._requestId = requestId;
  }
  /**
   * Status of the verification call
   */
  getStatus() {
    return this._status;
  }
  /**
   * If accepted, contains the request identification required for verification
   */
  getRequestId() {
    return this._requestId;
  }
  toJSON() {
    return {
      status: this._status,
      requestId: this._requestId
    };
  }
};

// src/services/query/query_translator.ts
var QueryTranslator = class extends InteractsXmlTrait {
  createQueryResultFromSoapResponse(content) {
    const env = this.readXmlElement(content);
    const values = this.findAtrributes(
      env,
      "body",
      "solicitaDescargaResponse",
      "solicitaDescargaResult"
    );
    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const requestId = values.idsolicitud;
    return new QueryResult(status, requestId);
  }
  createSoapRequest(requestBuilder, parameters) {
    return requestBuilder.query(parameters);
  }
};

// src/shared/code_request.ts
var CodeRequest = class _CodeRequest {
  static VALUES = [
    {
      code: 5e3,
      name: "Accepted",
      message: "Solicitud recibida con \xE9xito"
    },
    {
      code: 5002,
      name: "Exhausted",
      message: "Se agot\xF3 las solicitudes de por vida: M\xE1ximo para solicitudes con los mismos par\xE1metros"
    },
    {
      code: 5003,
      name: "MaximumLimitReaded",
      message: "Tope m\xE1ximo: Indica que se est\xE1 superando el tope m\xE1ximo de CFDI o Metadata"
    },
    {
      code: 5004,
      name: "EmptyResult",
      message: "No se encontr\xF3 la informaci\xF3n: Indica que no genero\u0301 paquetes por falta de informacio\u0301n."
    },
    {
      code: 5005,
      name: "Duplicated",
      message: "Solicitud duplicada: Si existe una solicitud vigente con los mismos par\xE1metros"
    }
  ];
  value;
  /**
   *
   * @param index - if assign by Values.code
   */
  constructor(index) {
    const value = _CodeRequest.VALUES.find((element) => index === element.code);
    if (!value) {
      this.value = this.getEntryValueOnUndefined();
      return;
    }
    this.value = value;
  }
  static getEntries() {
    return _CodeRequest.VALUES;
  }
  getEntryValueOnUndefined() {
    return { name: "Unknown", message: "Desconocida" };
  }
  getEtryValueOnUndefined() {
    return { name: "Unknown", message: "Desconocida" };
  }
  getEntryId() {
    return this.value.name;
  }
  getMessage() {
    return this.value.message;
  }
  getValue() {
    return this.value.code;
  }
  isTypeOf(type) {
    return this.getEntryId() === type;
  }
  toJSON() {
    return {
      value: this.value.code,
      message: this.value.message
    };
  }
};

// src/shared/status_request.ts
var StatusRequest = class _StatusRequest {
  static VALUES = [
    { code: 1, name: "Accepted", message: "Aceptada" },
    { code: 2, name: "InProgress", message: "En proceso" },
    { code: 3, name: "Finished", message: "Terminada" },
    { code: 4, name: "Failure", message: "Error" },
    { code: 5, name: "Rejected", message: "Rechazada" },
    { code: 6, name: "Expired", message: "Vencida" }
  ];
  value;
  /**
   *
   * @param index - if number is send assign value by array index of VALUES, values from 0 to 5 if string is send find value by Values.name
   */
  constructor(index) {
    if (typeof index === "number") {
      const value = _StatusRequest.VALUES.find((element) => index === element.code);
      if (!value) {
        this.value = this.getEntryValueOnUndefined();
        return;
      }
      this.value = value;
    }
    if (typeof index === "string") {
      const value = _StatusRequest.VALUES.find((element) => index === element.name);
      if (!value) {
        this.value = this.getEntryValueOnUndefined();
        return;
      }
      this.value = value;
    }
  }
  static getEntriesArray() {
    return _StatusRequest.VALUES;
  }
  getEntryValueOnUndefined() {
    return { name: "Unknown", message: "Desconocida" };
  }
  getEntryId() {
    return this.value.name;
  }
  getValue() {
    return this.value.code;
  }
  isTypeOf(type) {
    return this.getEntryId() === type;
  }
  toJSON() {
    return {
      value: this.value.code,
      message: this.value.message
    };
  }
};

// src/services/verify/verify_result.ts
var VerifyResult = class {
  _status;
  _statusRequest;
  _codeRequest;
  _numberCfdis;
  _packagesIds;
  constructor(statusCode, statusRequest, codeRequest, numberCfdis, ...packageIds) {
    this._status = statusCode;
    this._statusRequest = statusRequest;
    this._codeRequest = codeRequest;
    this._numberCfdis = numberCfdis;
    this._packagesIds = packageIds;
  }
  /**
   * Status of the verification call
   */
  getStatus() {
    return this._status;
  }
  /**
   * Status of the query
   */
  getStatusRequest() {
    return this._statusRequest;
  }
  /**
   * Code related to the status of the query
   */
  getCodeRequest() {
    return this._codeRequest;
  }
  /**
   * Number of CFDI given by the query
   */
  getNumberCfdis() {
    return this._numberCfdis;
  }
  /**
   * An array containing the package identifications, required to perform the download process
   */
  getPackageIds() {
    return this._packagesIds;
  }
  countPackages() {
    return this._packagesIds.length;
  }
  toJSON() {
    return {
      status: this._status.toJSON(),
      codeRequest: this._codeRequest.toJSON(),
      statusRequest: this._statusRequest.toJSON(),
      numberCfdis: this._numberCfdis,
      packagesIds: this._packagesIds
    };
  }
};

// src/services/verify/verify_translator.ts
var VerifyTranslator = class extends InteractsXmlTrait {
  createVerifyResultFromSoapResponse(content) {
    const env = this.readXmlElement(content);
    const values = this.findAtrributes(
      env,
      "body",
      "VerificaSolicitudDescargaResponse",
      "VerificaSolicitudDescargaResult"
    );
    const status = new StatusCode(Number(values.codestatus), values.mensaje);
    const statusRequest = new StatusRequest(Number(values.estadosolicitud));
    const codeRequest = new CodeRequest(Number(values.codigoestadosolicitud));
    const numberCfdis = Number(values.numerocfdis);
    const packages = this.findContents(
      env,
      "body",
      "VerificaSolicitudDescargaResponse",
      "VerificaSolicitudDescargaResult",
      "IdsPaquetes"
    );
    return new VerifyResult(status, statusRequest, codeRequest, numberCfdis, ...packages);
  }
  createSoapRequest(requestBuilder, requestId) {
    return requestBuilder.verify(requestId);
  }
};

// src/shared/enum/base_enum.ts
var BaseEnum = class {
  constructor(_id) {
    this._id = _id;
  }
  index() {
    return this._id;
  }
  isTypeOf(type) {
    return this._id === type;
  }
  toJSON() {
    return this._id;
  }
};

// src/shared/service_type.ts
var ServiceTypeEnum = /* @__PURE__ */ ((ServiceTypeEnum2) => {
  ServiceTypeEnum2["cfdi"] = "cfdi";
  ServiceTypeEnum2["retenciones"] = "retenciones";
  return ServiceTypeEnum2;
})(ServiceTypeEnum || {});
var ServiceType = class extends BaseEnum {
  equalTo(serviceType) {
    return this._id === serviceType._id;
  }
  value() {
    return ServiceTypeEnum[this._id];
  }
};

// src/shared/service_endpoints.ts
var ServiceEndpoints = class _ServiceEndpoints {
  constructor(_authenticate, _query, _verify, _download, _serviceType) {
    this._authenticate = _authenticate;
    this._query = _query;
    this._verify = _verify;
    this._download = _download;
    this._serviceType = _serviceType;
  }
  /**
   * Create an object with known endpoints for "CFDI regulares"
   */
  static cfdi() {
    return new _ServiceEndpoints(
      "https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc",
      "https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc",
      "https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc",
      "https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc",
      new ServiceType("cfdi")
    );
  }
  static retenciones() {
    return new _ServiceEndpoints(
      "https://retendescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc",
      "https://retendescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc",
      "https://retendescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc",
      "https://retendescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc",
      new ServiceType("retenciones")
    );
  }
  getAuthenticate() {
    return this._authenticate;
  }
  getQuery() {
    return this._query;
  }
  getVerify() {
    return this._verify;
  }
  getDownload() {
    return this._download;
  }
  getServiceType() {
    return this._serviceType;
  }
};

// src/service.ts
var Service = class {
  /**
   * Client constructor of "servicio de consulta y recuperación de comprobantes"
   *
   * @param endpoints - endpoints If undefined uses CFDI endpoints
   */
  constructor(_requestBuilder, _webClient, _currentToken, endpoints) {
    this._requestBuilder = _requestBuilder;
    this._webClient = _webClient;
    this._currentToken = _currentToken;
    this._endpoints = endpoints ?? ServiceEndpoints.cfdi();
  }
  _endpoints;
  /**
   * This method will reuse the current token,
   * it will create a new one if there is none or the current token is no longer valid
   */
  async obtainCurrentToken() {
    if (!this._currentToken?.isValid()) {
      this._currentToken = await this.authenticate();
    }
    return this._currentToken;
  }
  /**
   * Perform authentication and return a Token, the token might be invalid
   */
  async authenticate() {
    const authenticateTranslator = new AuthenticateTranslator();
    const soapBody = authenticateTranslator.createSoapRequest(this._requestBuilder);
    const responseBody = await this.consume(
      "http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica",
      this._endpoints.getAuthenticate(),
      soapBody
    );
    return authenticateTranslator.createTokenFromSoapResponse(responseBody);
  }
  /**
   * Consume the "SolicitaDescarga" web service
   */
  async query(parameters) {
    let defaultParameters = parameters;
    if (!defaultParameters.hasServiceType()) {
      defaultParameters = defaultParameters.withServiceType(this._endpoints.getServiceType());
    }
    if (!this._endpoints.getServiceType().equalTo(defaultParameters.getServiceType())) {
      throw new Error(
        `The service type endpoints ${defaultParameters.getServiceType().value()} does not match with the service type query ${this._endpoints.getServiceType().value()}`
      );
    }
    const queryTranslator = new QueryTranslator();
    const soapBody = queryTranslator.createSoapRequest(this._requestBuilder, defaultParameters);
    const currentToken = await this.obtainCurrentToken();
    console.log({ soapBody, currentToken, endpoint: this._endpoints.getQuery() });
    const responseBody = await this.consume(
      "http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga",
      this._endpoints.getQuery(),
      soapBody,
      currentToken
    );
    return queryTranslator.createQueryResultFromSoapResponse(responseBody);
  }
  /**
   * Consume the "VerificaSolicitudDescarga" web service
   */
  async verify(requestId) {
    const verifyTranslator = new VerifyTranslator();
    const soapBody = verifyTranslator.createSoapRequest(this._requestBuilder, requestId);
    const currentToken = await this.obtainCurrentToken();
    const responseBody = await this.consume(
      "http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga",
      this._endpoints.getVerify(),
      soapBody,
      currentToken
    );
    return verifyTranslator.createVerifyResultFromSoapResponse(responseBody);
  }
  async download(packageId) {
    const downloadTranslator = new DownloadTranslator();
    const soapBody = downloadTranslator.createSoapRequest(this._requestBuilder, packageId);
    const currentToken = await this.obtainCurrentToken();
    const responseBody = await this.consume(
      "http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar",
      this._endpoints.getDownload(),
      soapBody,
      currentToken
    );
    return downloadTranslator.createDownloadResultFromSoapResponse(responseBody);
  }
  async consume(soapAction, uri, body, token) {
    return ServiceConsumer.consume(this._webClient, soapAction, uri, body, token);
  }
};

// src/shared/complemento_undefined.ts
var ComplementoUndefined = class _ComplementoUndefined extends BaseEnum {
  Map = {
    undefined: {
      satCode: "",
      label: "Sin complemento definido"
    }
  };
  static create(id) {
    return new _ComplementoUndefined(id);
  }
  static undefined() {
    return new _ComplementoUndefined("undefined");
  }
  label() {
    return this.Map[this._id].label;
  }
  value() {
    return this.Map[this._id].satCode;
  }
  toJSON() {
    return this.value();
  }
};

// src/shared/date_time_period.ts
var DateTimePeriod = class _DateTimePeriod {
  _start;
  _end;
  constructor(start, end) {
    if (end.compareTo(start) < 0) {
      throw new Error("The final date must be greater than the initial date");
    }
    this._start = start;
    this._end = end;
  }
  static create(start, end) {
    return new _DateTimePeriod(start, end);
  }
  static createFromValues(start, end) {
    return new _DateTimePeriod(new DateTime(start), new DateTime(end));
  }
  getStart() {
    return this._start;
  }
  getEnd() {
    return this._end;
  }
  toJSON() {
    return {
      start: this._start.toJSON(),
      end: this._end.toJSON()
    };
  }
};

// src/shared/document_status.ts
var DocumentStatusEnum = /* @__PURE__ */ ((DocumentStatusEnum2) => {
  DocumentStatusEnum2["undefined"] = "";
  DocumentStatusEnum2["active"] = "1";
  DocumentStatusEnum2["cancelled"] = "0";
  return DocumentStatusEnum2;
})(DocumentStatusEnum || {});
var DocumentStatus = class extends BaseEnum {
  value() {
    return DocumentStatusEnum[this._id];
  }
  toJSON() {
    return DocumentStatusEnum[this._id];
  }
};

// src/shared/document_type.ts
var DocumentTypeEnum = /* @__PURE__ */ ((DocumentTypeEnum2) => {
  DocumentTypeEnum2["undefined"] = "";
  DocumentTypeEnum2["ingreso"] = "I";
  DocumentTypeEnum2["egreso"] = "E";
  DocumentTypeEnum2["traslado"] = "T";
  DocumentTypeEnum2["nomina"] = "N";
  DocumentTypeEnum2["pago"] = "P";
  return DocumentTypeEnum2;
})(DocumentTypeEnum || {});
var DocumentType = class extends BaseEnum {
  value() {
    return DocumentTypeEnum[this._id];
  }
  toJSON() {
    return DocumentTypeEnum[this._id];
  }
};

// src/shared/download_type.ts
var DownloadTypeEnum = /* @__PURE__ */ ((DownloadTypeEnum2) => {
  DownloadTypeEnum2["issued"] = "RfcEmisor";
  DownloadTypeEnum2["received"] = "RfcReceptor";
  return DownloadTypeEnum2;
})(DownloadTypeEnum || {});
var DownloadType = class extends BaseEnum {
  value() {
    return DownloadTypeEnum[this._id];
  }
  toJSON() {
    return DownloadTypeEnum[this._id];
  }
};

// src/shared/request_type.ts
var RequestTypeEnum = /* @__PURE__ */ ((RequestTypeEnum2) => {
  RequestTypeEnum2["xml"] = "xml";
  RequestTypeEnum2["metadata"] = "metadata";
  return RequestTypeEnum2;
})(RequestTypeEnum || {});
var RequestType = class extends BaseEnum {
  getQueryAttributeValue(serviceType) {
    if (this.isTypeOf("xml") && serviceType.isTypeOf("cfdi")) {
      return "CFDI";
    }
    if (this.isTypeOf("xml") && serviceType.isTypeOf("retenciones")) {
      return "Retencion";
    }
    return "Metadata";
  }
  value() {
    return RequestTypeEnum[this._id];
  }
};

// src/shared/rfc_on_behalf.ts
var RfcOnBehalf = class extends AbstractRfcFilter {
};

// src/shared/uuid.ts
var Uuid = class _Uuid {
  constructor(_value) {
    this._value = _value;
  }
  static create(value) {
    const newValue = value.toLowerCase();
    if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/.test(newValue)) {
      throw new Error("UUID does not have the correct format");
    }
    return new _Uuid(newValue);
  }
  static empty() {
    return new _Uuid("");
  }
  static check(value) {
    try {
      _Uuid.create(value);
      return true;
    } catch {
      return false;
    }
  }
  isEmpty() {
    return this._value === "";
  }
  getValue() {
    return this._value;
  }
  toJSON() {
    return this._value;
  }
};

// src/services/query/query_parameters.ts
var QueryParameters = class _QueryParameters {
  constructor(_period, _downloadType, _requestType, _documentType, _complement, _documentStatus, _uuid, _rfcOnBehalf, _rfcMatches) {
    this._period = _period;
    this._downloadType = _downloadType;
    this._requestType = _requestType;
    this._documentType = _documentType;
    this._complement = _complement;
    this._documentStatus = _documentStatus;
    this._uuid = _uuid;
    this._rfcOnBehalf = _rfcOnBehalf;
    this._rfcMatches = _rfcMatches;
  }
  _serviceType;
  static create(period, downloadType, requestType) {
    const defaultDownloadType = downloadType ?? new DownloadType("issued");
    const defaultRequestType = requestType ?? new RequestType("metadata");
    const currentTime = DateTime.now().formatSat();
    return new _QueryParameters(
      period ?? DateTimePeriod.createFromValues(currentTime, currentTime),
      defaultDownloadType,
      defaultRequestType,
      new DocumentType("undefined"),
      new ComplementoUndefined("undefined"),
      new DocumentStatus("undefined"),
      Uuid.empty(),
      RfcOnBehalf.empty(),
      RfcMatches.create()
    );
  }
  hasServiceType() {
    return void 0 !== this._serviceType;
  }
  getServiceType() {
    if (void 0 === this._serviceType) {
      throw new Error("Service type has not been set");
    }
    return this._serviceType;
  }
  getPeriod() {
    return this._period;
  }
  getDownloadType() {
    return this._downloadType;
  }
  getRequestType() {
    return this._requestType;
  }
  getDocumentType() {
    return this._documentType;
  }
  getComplement() {
    return this._complement;
  }
  getDocumentStatus() {
    return this._documentStatus;
  }
  getUuid() {
    return this._uuid;
  }
  getRfcOnBehalf() {
    return this._rfcOnBehalf;
  }
  getRfcMatches() {
    return this._rfcMatches;
  }
  getRfcMatch() {
    return this._rfcMatches.getFirst();
  }
  withServiceType(serviceType) {
    this._serviceType = serviceType;
    return this;
  }
  withPeriod(period) {
    this._period = period;
    return this;
  }
  withDownloadType(downloadType) {
    this._downloadType = downloadType;
    return this;
  }
  withRequestType(requestType) {
    this._requestType = requestType;
    return this;
  }
  withDocumentType(documentType) {
    this._documentType = documentType;
    return this;
  }
  withComplement(complement) {
    this._complement = complement;
    return this;
  }
  withDocumentStatus(documentStatus) {
    this._documentStatus = documentStatus;
    return this;
  }
  withUuid(uuid) {
    this._uuid = uuid;
    return this;
  }
  withRfcOnBehalf(rfcOnBehalf) {
    this._rfcOnBehalf = rfcOnBehalf;
    return this;
  }
  withRfcMatches(rfcMatches) {
    this._rfcMatches = rfcMatches;
    return this;
  }
  withRfcMatch(rfcMatch) {
    this._rfcMatches = RfcMatches.create(rfcMatch);
    return this;
  }
  toJSON() {
    return {
      serviceType: this._serviceType,
      period: this._period,
      downloadType: this._downloadType,
      requestType: this._requestType,
      documentType: this._documentType,
      complement: this._complement,
      documentStatus: this._documentStatus,
      uuid: this._uuid,
      rfcOnBehalf: this._rfcOnBehalf,
      rfcMatches: this._rfcMatches
    };
  }
};

// src/shared/complemento_cfdi.ts
var ComplementoCfdi = class _ComplementoCfdi extends BaseEnum {
  Map = {
    undefined: {
      satCode: "",
      label: "Sin complemento definido"
    },
    acreditamientoIeps10: {
      satCode: "acreditamientoieps10",
      label: "Acreditamiento del IEPS 1.0"
    },
    aerolineas10: {
      satCode: "aerolineas",
      label: "Aerol\xEDneas 1.0"
    },
    cartaporte10: {
      satCode: "cartaporte10",
      label: "Carta Porte 1.0"
    },
    cartaporte20: {
      satCode: "cartaporte20",
      label: "Carta Porte 2.0"
    },
    certificadoDestruccion10: {
      satCode: "certificadodedestruccion",
      label: "Certificado de destrucci\xF3n 1.0"
    },
    cfdiRegistroFiscal10: {
      satCode: "cfdiregistrofiscal",
      label: "CFDI Registro fiscal 1.0"
    },
    comercioExterior10: {
      satCode: "comercioexterior10",
      label: "Comercio Exterior 1.0"
    },
    comercioExterior11: {
      satCode: "comercioexterior11",
      label: "Comercio Exterior 1.1"
    },
    consumoCombustibles10: {
      satCode: "consumodecombustibles",
      label: "Consumo de combustibles 1.0"
    },
    consumoCombustibles11: {
      satCode: "consumodecombustibles11",
      label: "Consumo de combustibles 1.1"
    },
    detallista: {
      satCode: "detallista",
      label: "Detallista"
    },
    divisas10: {
      satCode: "divisas",
      label: "Divisas 1.0"
    },
    donatarias11: {
      satCode: "donat11",
      label: "Donatarias 1.1"
    },
    estadoCuentaCombustibles11: {
      satCode: "ecc11",
      label: "Estado de cuenta de combustibles 1.1"
    },
    estadoCuentaCombustibles12: {
      satCode: "ecc12",
      label: "Estado de cuenta de combustibles 1.2"
    },
    gastosHidrocarburos10: {
      satCode: "gastoshidrocarburos10",
      label: "Gastos Hidrocarburos 1.0"
    },
    institucionesEducativasPrivadas10: {
      satCode: "iedu",
      label: "Instituciones educativas privadas 1.0"
    },
    impuestosLocales10: {
      satCode: "implocal",
      label: "Impuestos locales 1.0"
    },
    ine11: {
      satCode: "ine11",
      label: "INE 1.1"
    },
    ingresosHidrocarburos10: {
      satCode: "ingresoshidrocarburos",
      label: "Ingresos Hidrocarburos 1.0"
    },
    leyendasFiscales10: {
      satCode: "leyendasfisc",
      label: "Leyendas Fiscales 1.0"
    },
    nomina11: {
      satCode: "nomina11",
      label: "N\xF3mina 1.1"
    },
    nomina12: {
      satCode: "nomina12",
      label: "N\xF3mina 1.2"
    },
    notariosPublicos10: {
      satCode: "notariospublicos",
      label: "Notarios p\xFAblicos 1.0"
    },
    obrasArtePlasticasYAntiguedades10: {
      satCode: "obrasarteantiguedades",
      label: "Obras de arte pl\xE1sticas y antig\xFCedades 1.0"
    },
    pagoEnEspecie10: {
      satCode: "pagoenespecie",
      label: "Pago en especie 1.0"
    },
    recepcionPagos10: {
      satCode: "pagos10",
      label: "Recepci\xF3n de pagos 1.0"
    },
    recepcionPagos20: {
      satCode: "pagos20",
      label: "Recepci\xF3n de pagos 2.0"
    },
    personaFisicaIntegranteCoordinado10: {
      satCode: "pfic",
      label: "Persona f\xEDsica integrante de coordinado 1.0"
    },
    renovacionYSustitucionVehiculos10: {
      satCode: "renovacionysustitucionvehiculos",
      label: "Renovaci\xF3n y sustituci\xF3n de veh\xEDculos 1.0"
    },
    serviciosParcialesConstruccion10: {
      satCode: "servicioparcialconstruccion",
      label: "Servicios parciales de construcci\xF3n 1.0"
    },
    spei: {
      satCode: "spei",
      label: "SPEI"
    },
    terceros11: {
      satCode: "terceros11",
      label: "Terceros 1.1"
    },
    turistaPasajeroExtranjero10: {
      satCode: "turistapasajeroextranjero",
      label: "Turista pasajero extranjero 1.0"
    },
    valesDespensa10: {
      satCode: "valesdedespensa",
      label: "Vales de despensa 1.0"
    },
    vehiculoUsado10: {
      satCode: "vehiculousado",
      label: "Veh\xEDculo usado 1.0"
    },
    ventaVehiculos11: {
      satCode: "ventavehiculos11",
      label: "Venta de veh\xEDculos 1.1"
    }
  };
  static create(id) {
    return new _ComplementoCfdi(id);
  }
  static undefined() {
    return new _ComplementoCfdi("undefined");
  }
  label() {
    return this.Map[this._id].label;
  }
  value() {
    return this.Map[this._id].satCode;
  }
  toJSON() {
    return this.value();
  }
};

// src/shared/complemento_retenciones.ts
var ComplementoRetenciones = class _ComplementoRetenciones extends BaseEnum {
  Map = {
    undefined: {
      satCode: "",
      label: "Sin complemento definido"
    },
    arrendamientoEnFideicomiso: {
      satCode: "arrendamientoenfideicomiso",
      label: "Arrendamiento en fideicomiso"
    },
    dividendos: {
      satCode: "dividendos",
      label: "Dividendos"
    },
    enajenacionAcciones: {
      satCode: "enajenaciondeacciones",
      label: "Enajenaci\xF3n de acciones"
    },
    fideicomisoNoEmpresarial: {
      satCode: "fideicomisonoempresarial",
      label: "Fideicomiso no empresarial"
    },
    intereses: {
      satCode: "intereses",
      label: "Intereses"
    },
    interesesHipotecarios: {
      satCode: "intereseshipotecarios",
      label: "Intereses hipotecarios"
    },
    operacionesConDerivados: {
      satCode: "operacionesconderivados",
      label: "Operaciones con derivados"
    },
    pagosAExtranjeros: {
      satCode: "pagosaextranjeros",
      label: "Pagos a extranjeros"
    },
    planesRetiro10: {
      satCode: "planesderetiro",
      label: "Planes de retiro 1.0"
    },
    planesRetiro11: {
      satCode: "planesderetiro11",
      label: "Planes de retiro 1.1"
    },
    premios: {
      satCode: "premios",
      label: "Premios"
    },
    sectorFinanciero: {
      satCode: "sectorfinanciero",
      label: "Sector Financiero"
    },
    serviciosPlataformasTecnologicas: {
      satCode: "serviciosplataformastecnologicas10",
      label: "Servicios Plataformas Tecnol\xF3gicas"
    }
  };
  static create(id) {
    return new _ComplementoRetenciones(id);
  }
  static undefined() {
    return new _ComplementoRetenciones("undefined");
  }
  label() {
    return this.Map[this._id].label;
  }
  value() {
    return this.Map[this._id].satCode;
  }
  toJSON() {
    return this.value();
  }
};

// src/web_client/cresponse.ts
var CResponse = class {
  _statusCode;
  _body;
  _headers;
  constructor(statuscode, body, headers = {}) {
    this._statusCode = statuscode;
    this._body = body;
    this._headers = headers;
  }
  getStatusCode() {
    return this._statusCode;
  }
  getBody() {
    return this._body;
  }
  getHeaders() {
    return this._headers;
  }
  isEmpty() {
    return this._body === "";
  }
  statusCodeIsClientError() {
    return this._statusCode < 500 && this._statusCode >= 400;
  }
  statusCodeIsServerError() {
    return this._statusCode < 600 && this._statusCode >= 500;
  }
  toJSON() {
    return {
      statusCode: this._statusCode,
      body: this._body,
      headers: this._headers
    };
  }
};

// src/web_client/https_web_client.ts
var import_node_https = __toESM(require("https"), 1);
var HttpsWebClient = class {
  _fireRequestClosure;
  _fireResponseClosure;
  constructor(onFireRequest, onFireResponse) {
    this._fireRequestClosure = onFireRequest;
    this._fireResponseClosure = onFireResponse;
  }
  fireRequest(request) {
    if (this._fireRequestClosure) {
      this._fireRequestClosure(request);
    }
  }
  fireResponse(response) {
    if (this._fireResponseClosure) {
      this._fireResponseClosure(response);
    }
  }
  async call(request) {
    const options = {
      method: request.getMethod(),
      headers: request.getHeaders()
    };
    return new Promise((resolve, reject) => {
      let clientRequest;
      try {
        clientRequest = import_node_https.default.request(request.getUri(), options, (response) => {
          const code = response.statusCode ?? 0;
          const body = [];
          response.on("data", (chunk) => body.push(chunk));
          response.on("end", () => {
            const responseString = Buffer.concat(body).toString();
            resolve(new CResponse(code, responseString));
          });
        });
      } catch (error) {
        const catchedError = error;
        const errorResponse = new CResponse(0, catchedError.message, {});
        throw new WebClientException(catchedError.message, request, errorResponse);
      }
      clientRequest.on("error", (error) => {
        const errorResponse = new CResponse(0, error.message, {});
        reject(new WebClientException(error.message, request, errorResponse));
      });
      clientRequest.on("timeout", () => {
        clientRequest.destroy();
        reject(new Error("Request time out"));
      });
      clientRequest.write(request.getBody());
      clientRequest.end();
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbstractRfcFilter,
  AuthenticateTranslator,
  BaseEnum,
  CRequest,
  CResponse,
  CfdiFileFilter,
  CfdiPackageReader,
  CodeRequest,
  ComplementoCfdi,
  ComplementoRetenciones,
  ComplementoUndefined,
  CreateTemporaryZipFileException,
  CsvReader,
  DateTime,
  DateTimePeriod,
  DocumentStatus,
  DocumentType,
  DownloadResult,
  DownloadTranslator,
  DownloadType,
  Fiel,
  FielRequestBuilder,
  FilteredPackageReader,
  Helpers,
  HttpClientError,
  HttpServerError,
  HttpsWebClient,
  InteractsXmlTrait,
  MetadataContent,
  MetadataFileFilter,
  MetadataItem,
  MetadataPackageReader,
  MetadataPreprocessor,
  NullFileFilter,
  OpenZipFileException,
  PackageReaderException,
  QueryParameters,
  QueryResult,
  QueryTranslator,
  RequestBuilderException,
  RequestType,
  RfcMatch,
  RfcMatches,
  RfcOnBehalf,
  Service,
  ServiceConsumer,
  ServiceEndpoints,
  ServiceType,
  SoapFaultError,
  SoapFaultInfo,
  SoapFaultInfoExtractor,
  StatusCode,
  StatusRequest,
  ThirdPartiesExtractor,
  ThirdPartiesFileFilter,
  ThirdPartiesRecords,
  Token,
  Uuid,
  VerifyResult,
  VerifyTranslator,
  WebClientException
});
