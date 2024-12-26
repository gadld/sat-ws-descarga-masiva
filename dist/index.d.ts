import { DateTime as DateTime$1, DurationLike } from 'luxon';
import JSZip from 'jszip';
import { Credential } from '@nodecfdi/credentials';
import { Rfc } from '@nodecfdi/rfc';

/**
 * Helper functions used by the library.
 */
declare class Helpers {
    static nospaces(input: string): string;
    static cleanPemContents(pemContents: string): string;
    static htmlspecialchars(stringToReplace: string): string;
}

/**
 * Contain functions to interact with XML contents and XML DOM
 *
 * This class is internal, do not use it outside this project
 */
declare class InteractsXmlTrait {
    readXmlDocument(source: string): Document;
    readXmlElement(source: string): Element;
    findElement(element: Element, ...names: string[]): Element | undefined;
    findContent(element: Element, ...names: string[]): string;
    extractElementContent(element: Element): string;
    findElements(element: Element, ...names: string[]): Element[];
    findContents(element: Element, ...names: string[]): string[];
    /**
     * Find the element determined by the chain of children and return the attributes as an
     * array using the attribute name as array key and attribute value as entry value.
     */
    findAtrributes(element: Element, ...search: string[]): Record<string, string>;
}

/**
 * Defines a date and time
 */
declare class DateTime {
    private _value;
    private readonly _defaultTimeZone;
    /**
     * DateTime constructor.
     *
     * If value is an integer is used as a timestamp, if is a string is evaluated
     * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
     *
     * @throws Error if unable to create a DateTime
     */
    constructor(value?: number | string | DateTime$1, defaultTimeZone?: string);
    /**
     * Create a DateTime instance
     *
     * If value is an integer is used as a timestamp, if is a string is evaluated
     * as an argument for DateTimeImmutable and if it is DateTimeImmutable is used as is.
     */
    static create(value?: number | string | DateTime$1, defaultTimeZone?: string): DateTime;
    static now(): DateTime;
    formatSat(): string;
    format(format: string, timezone?: string): string;
    formateDefaultTimeZone(): string;
    formatTimeZone(timezone: string): string;
    /**
     * add or sub in given DurationLike
     *
     */
    modify(time: DurationLike): DateTime;
    compareTo(otherDate: DateTime): number;
    equalsTo(expectedExpires: DateTime): boolean;
    toJSON(): number;
    private castStringToDateTimeImmutable;
}

declare class Token {
    private readonly _expires;
    private readonly _value;
    private readonly _created;
    constructor(created: DateTime, _expires: DateTime, _value: string);
    getCreated(): DateTime;
    getExpires(): DateTime;
    getValue(): string;
    /**
     * A token is empty if does not contains an internal value
     */
    isValueEmpty(): boolean;
    /**
     * A token is expired if the expiration date is greater or equal to current time
     */
    isExpired(): boolean;
    /**
     * A token is valid if contains a value and is not expired
     */
    isValid(): boolean;
    toJSON(): {
        created: DateTime;
        expires: DateTime;
        value: string;
    };
}

declare class CRequest {
    private readonly _method;
    private readonly _uri;
    private readonly _body;
    private readonly _headers;
    constructor(method: string, uri: string, body: string, headers: Record<string, string>);
    getMethod(): string;
    getUri(): string;
    getBody(): string;
    getHeaders(): Record<string, string>;
    defaultHeaders(): {
        'Content-type': string;
        'Accept': string;
        'Cache-Control': string;
    };
    toJSON(): {
        method: string;
        uri: string;
        body: string;
        headers: Record<string, string>;
    };
}

declare class CResponse {
    private readonly _statusCode;
    private readonly _body;
    private readonly _headers;
    constructor(statuscode: number, body: string, headers?: Record<string, string>);
    getStatusCode(): number;
    getBody(): string;
    getHeaders(): Record<string, string>;
    isEmpty(): boolean;
    statusCodeIsClientError(): boolean;
    statusCodeIsServerError(): boolean;
    toJSON(): {
        statusCode: number;
        body: string;
        headers: Record<string, string>;
    };
}

type WebClientInterface = {
    /**
     * Make the Http call to the web service
     * This method should *not* call fireRequest/fireResponse
     *
     * @throws WebClientException when an error is found
     */
    call(request: CRequest): Promise<CResponse>;
    /**
     * Method called before calling the web service
     */
    fireRequest(request: CRequest): void;
    /**
     * Method called after calling the web service
     */
    fireResponse(response: CResponse): void;
};

declare class ServiceConsumer {
    static consume(webClient: WebClientInterface, soapAction: string, uri: string, body: string, token?: Token): Promise<string>;
    execute(webClient: WebClientInterface, soapAction: string, uri: string, body: string, token?: Token): Promise<string>;
    createRequest(uri: string, body: string, headers: Record<string, string>): CRequest;
    createHeaders(soapAction: string, token?: Token): Record<string, string>;
    runRequest(webClient: WebClientInterface, request: CRequest): Promise<CResponse>;
    checkErrors(request: CRequest, response: CResponse, exception?: Error): void;
}

declare class SoapFaultInfo {
    private readonly _code;
    private readonly _message;
    constructor(code: string, message: string);
    getCode(): string;
    getMessage(): string;
    toJSON(): {
        code: string;
        message: string;
    };
}

declare class SoapFaultInfoExtractor extends InteractsXmlTrait {
    static extract(source: string): SoapFaultInfo | undefined;
    obtainFault(source: string): SoapFaultInfo | undefined;
}

/**
 * Expected behavior of a PackageReader contract
 */
type PackageReaderInterface = {
    /**
     * Traverse each file inside the package, with the filename as key and file content as value
     */
    fileContents(): AsyncGenerator<Map<string, string>>;
    /**
     * Return the number of elements on the package
     */
    count(): Promise<number>;
    /**
     * Retrieve the currently open file name
     */
    getFilename(): string;
};

declare class CfdiPackageReader implements PackageReaderInterface {
    private readonly _packageReader;
    constructor(_packageReader: PackageReaderInterface);
    static createFromFile(filename: string): Promise<CfdiPackageReader>;
    static createFromContents(contents: string): Promise<CfdiPackageReader>;
    cfdis(): AsyncGenerator<Map<string, string>>;
    getFilename(): string;
    count(): Promise<number>;
    fileContents(): AsyncGenerator<Map<string, string>>;
    jsonSerialize(): Promise<{
        source: string;
        files: Record<string, string>;
        cfdis: Record<string, string>;
    }>;
    cfdisToArray(): Promise<{
        uuid: string;
        content: string;
    }[]>;
    fileContentsToArray(): Promise<{
        name: string;
        content: string;
    }[]>;
}

declare abstract class PackageReaderException extends Error {
}

declare class CreateTemporaryZipFileException extends PackageReaderException {
    private readonly _previous?;
    constructor(message: string, previous?: Error);
    static create(message: string, previous?: Error): CreateTemporaryZipFileException;
    getPrevious(): Error | undefined;
}

declare class OpenZipFileException extends PackageReaderException {
    private readonly _filename;
    private readonly _previous?;
    private readonly _code;
    constructor(message: string, code: number, filename: string, previous?: Error);
    static create(filename: string, code: number, previous?: Error): OpenZipFileException;
    getFileName(): string;
    getCode(): number;
    getPrevious(): Error | undefined;
}

type ReadLineInterface = {
    [Symbol.asyncIterator](): AsyncIterableIterator<string>;
};
/**
 * Helper to iterate inside a CSV file
 * The file must have on the first line the headers.
 * The file uses "~" as separator and "|" as text delimiter.
 */
declare class CsvReader {
    private readonly _iterator;
    constructor(_iterator: ReadLineInterface);
    static createIteratorFromContents(contents: string): ReadLineInterface;
    static createFromContents(contents: string): CsvReader;
    records(): AsyncGenerator<Record<string, string>>;
    /**
     * Like array.concat but complement missing values or missing keys (#extra-01, #extra-02, etc...)
     */
    combine(keys: string[], values: string[]): Record<string, string>;
}

/**
 * Filter by filename or content contract
 */
type FileFilterInterface = {
    /**
     * Filter the file name
     */
    filterFilename(filename: string): boolean;
    /**
     * Filter the contents
     *
     * @param contents - Content
     * @returns boolean
     */
    filterContents(contents: string): boolean;
};

declare class CfdiFileFilter implements FileFilterInterface {
    static obtainUuidFromXmlCfdi(xmlContent: string): string;
    filterFilename(filename: string): boolean;
    filterContents(contents: string): boolean;
}

/**
 * Implementation to filter a Metadata Package file contents
 *
 */
declare class MetadataFileFilter implements FileFilterInterface {
    filterFilename(filename: string): boolean;
    filterContents(contents: string): boolean;
}

/**
 * NullObject patern, it does not filter any file contents
 */
declare class NullFileFilter implements FileFilterInterface {
    filterFilename(_filename: string): boolean;
    filterContents(_contents: string): boolean;
}

/**
 * Implementation to filter a Metadata Package file contents
 */
declare class ThirdPartiesFileFilter implements FileFilterInterface {
    filterFilename(filename: string): boolean;
    filterContents(contents: string): boolean;
}

declare class FilteredPackageReader implements PackageReaderInterface {
    private readonly _filename;
    private readonly _archive;
    private _removeOnDestruct;
    private _filter;
    constructor(filename: string, archive: JSZip);
    static createFromFile(filename: string): Promise<FilteredPackageReader>;
    static createFromContents(contents: string): Promise<FilteredPackageReader>;
    destruct(): Promise<void>;
    fileContents(): AsyncGenerator<Map<string, string>>;
    count(): Promise<number>;
    getFilename(): string;
    getArchive(): JSZip;
    getFilter(): FileFilterInterface;
    setFilter(filter?: FileFilterInterface): void;
    changeFilter(filter: FileFilterInterface): FileFilterInterface;
    jsonSerialize(): Promise<{
        source: string;
        files: Record<string, string>;
    }>;
}

type MetadataItemInterface = {
    key: string;
    value: string;
};

/**
 * Metadata DTO object
 *
 * This collection of magic properties is reported as of 2019-08-01, if it changes use all()/get() methods
 *
 * - property-read string uuid
 * - property-read string rfcEmisor
 * - property-read string nombreEmisor
 * - property-read string rfcReceptor
 * - property-read string nombreReceptor
 * - property-read string rfcPac
 * - property-read string fechaEmision
 * - property-read string fechaCertificacionSat
 * - property-read string monto
 * - property-read string efectoComprobante
 * - property-read string estatus
 * - property-read string fechaCancelacion
 * - property-read string rfcACuentaTerceros
 * - property-read string nombreACuentaTerceros
 */
declare class MetadataItem {
    private readonly _data;
    constructor(data: Record<string, string>);
    get(key: string): string;
    /**
     *
     * returns all keys and values in a record form.
     */
    all(): Record<string, string>;
    [Symbol.iterator](): IterableIterator<MetadataItemInterface>;
}

type ThirdPartiesInterface = {
    RfcACuentaTerceros: string;
    NombreACuentaTerceros: string;
};
/**
 * Class to extract the data from a "third parties" file.
 */
declare class ThirdPartiesExtractor {
    private readonly _csvReader;
    constructor(_csvReader: CsvReader);
    static createFromPackageReader(packageReader: PackageReaderInterface): Promise<ThirdPartiesExtractor>;
    eachRecord(): AsyncGenerator<Map<string, ThirdPartiesInterface>>;
}

declare class ThirdPartiesRecords {
    private readonly _records;
    constructor(_records: Record<string, ThirdPartiesInterface | undefined>);
    static createEmpty(): ThirdPartiesRecords;
    static createFromPackageReader(packageReader: PackageReaderInterface): Promise<ThirdPartiesRecords>;
    private static formatUuid;
    addToData(data: Record<string, string | undefined>): Record<string, string>;
    getDataFromUuid(uuid: string): ThirdPartiesInterface;
}

declare class MetadataContent {
    private readonly _csvReader;
    private readonly _thirdParties;
    /**
     * The iterator will be used in a foreach loop to create MetadataItems
     * The first iteration must contain an array of header names that will be renames to lower case first letter
     * The next iterations must contain an array with data
     */
    constructor(_csvReader: CsvReader, _thirdParties: ThirdPartiesRecords);
    /**
     * This method fix the content and create a SplTempFileObject to store the information
     */
    static createFromContents(contents: string, thirdParties?: ThirdPartiesRecords | undefined): MetadataContent;
    eachItem(): AsyncGenerator<MetadataItem>;
    private changeArrayKeysFirstLetterLoweCase;
}

/**
 * This preprocesor fixes metadata issues:
 * - SAT CSV EOL is <CR><LF> and might contain <LF> inside a field
 *
 * @see MetadataContent
 */
declare class MetadataPreprocessor {
    /** The data to process */
    private _contents;
    constructor(contents: string);
    private readonly CONTROL_CR;
    private readonly CONTROL_LF;
    private readonly CONTROL_CRLF;
    getContents(): string;
    fix(): void;
    fixEolCrLf(): void;
}

declare class MetadataPackageReader implements PackageReaderInterface {
    private readonly _packageReader;
    private _thirdParties?;
    constructor(_packageReader: PackageReaderInterface, _thirdParties?: ThirdPartiesRecords | undefined);
    static createFromFile(fileName: string): Promise<MetadataPackageReader>;
    static createFromContents(contents: string): Promise<MetadataPackageReader>;
    getThirdParties(): Promise<ThirdPartiesRecords>;
    metadata(): AsyncGenerator<MetadataItem>;
    getFilename(): string;
    count(): Promise<number>;
    fileContents(): AsyncGenerator<Map<string, string>>;
    jsonSerialize(): Promise<{
        source: string;
        files: Record<string, string>;
        metadata: Record<string, Record<string, string>>;
    }>;
    metadataToArray(): Promise<MetadataItem[]>;
}

/**
 * Defines a eFirma/FIEL/FEA
 * This object is based on nodecfdi/credentials Credential object
 *
 * @see Credential
 */
declare class Fiel {
    private readonly _credential;
    constructor(_credential: Credential);
    /**
     * Create a Fiel based on certificate and private key contents
     */
    static create(certificateContents: string, privateKeyContents: string, passPhrase: string): Fiel;
    sign(toSign: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'): string;
    isValid(): boolean;
    getCertificatePemContents(): string;
    getRfc(): string;
    getCertificateSerial(): string;
    /** missing function this.credential.certificate().issuerAsRfc4514() */
    getCertificateIssuerName(): string;
}

type ComplementoInterface<T> = {
    label(): string;
    value(): string;
    toJSON(): string;
    isTypeOf(type: T): boolean;
};

declare abstract class BaseEnum<T extends string> {
    readonly _id: T;
    constructor(_id: T);
    index(): string;
    isTypeOf(type: T): boolean;
    toJSON(): string;
    abstract value(): string;
}

type ComplementoCfdiTypes = 'undefined' | 'acreditamientoIeps10' | 'aerolineas10' | 'cartaporte10' | 'cartaporte20' | 'certificadoDestruccion10' | 'cfdiRegistroFiscal10' | 'comercioExterior10' | 'comercioExterior11' | 'consumoCombustibles10' | 'consumoCombustibles11' | 'detallista' | 'divisas10' | 'donatarias11' | 'estadoCuentaCombustibles11' | 'estadoCuentaCombustibles12' | 'gastosHidrocarburos10' | 'institucionesEducativasPrivadas10' | 'impuestosLocales10' | 'ine11' | 'ingresosHidrocarburos10' | 'leyendasFiscales10' | 'nomina11' | 'nomina12' | 'notariosPublicos10' | 'obrasArtePlasticasYAntiguedades10' | 'pagoEnEspecie10' | 'recepcionPagos10' | 'recepcionPagos20' | 'personaFisicaIntegranteCoordinado10' | 'renovacionYSustitucionVehiculos10' | 'serviciosParcialesConstruccion10' | 'spei' | 'terceros11' | 'turistaPasajeroExtranjero10' | 'valesDespensa10' | 'vehiculoUsado10' | 'ventaVehiculos11';
declare class ComplementoCfdi extends BaseEnum<ComplementoCfdiTypes> implements ComplementoInterface<ComplementoCfdiTypes> {
    private readonly Map;
    static create(id: ComplementoCfdiTypes): ComplementoCfdi;
    static undefined(): ComplementoCfdi;
    label(): string;
    value(): string;
    toJSON(): string;
}

type ComplementoRetencionesTypes = 'undefined' | 'arrendamientoEnFideicomiso' | 'dividendos' | 'enajenacionAcciones' | 'fideicomisoNoEmpresarial' | 'intereses' | 'interesesHipotecarios' | 'operacionesConDerivados' | 'pagosAExtranjeros' | 'planesRetiro10' | 'planesRetiro11' | 'premios' | 'sectorFinanciero' | 'serviciosPlataformasTecnologicas';
declare class ComplementoRetenciones extends BaseEnum<ComplementoRetencionesTypes> implements ComplementoInterface<ComplementoRetencionesTypes> {
    private readonly Map;
    static create(id: ComplementoRetencionesTypes): ComplementoRetenciones;
    static undefined(): ComplementoRetenciones;
    label(): string;
    value(): string;
    toJSON(): string;
}

/**
 * Defines a period of time by start of period and end of period values
 */
declare class DateTimePeriod {
    private readonly _start;
    private readonly _end;
    constructor(start: DateTime, end: DateTime);
    static create(start: DateTime, end: DateTime): DateTimePeriod;
    static createFromValues(start: string, end: string): DateTimePeriod;
    getStart(): DateTime;
    getEnd(): DateTime;
    toJSON(): {
        start: number;
        end: number;
    };
}

type DocumentStatusTypes = 'undefined' | 'active' | 'cancelled';
declare class DocumentStatus extends BaseEnum<DocumentStatusTypes> {
    value(): string;
    toJSON(): string;
}

type DocumentTypeTypes = 'undefined' | 'ingreso' | 'egreso' | 'traslado' | 'nomina' | 'pago';
declare class DocumentType extends BaseEnum<DocumentTypeTypes> {
    value(): string;
    toJSON(): string;
}

type DownloadTypeTypes = 'issued' | 'received';
declare class DownloadType extends BaseEnum<DownloadTypeTypes> {
    value(): string;
    toJSON(): string;
}

type ServiceTypeValues = 'cfdi' | 'retenciones';
declare class ServiceType extends BaseEnum<ServiceTypeValues> {
    equalTo(serviceType: ServiceType): boolean;
    value(): string;
}

type RequestTypeTypes = 'xml' | 'metadata';
declare class RequestType extends BaseEnum<RequestTypeTypes> {
    getQueryAttributeValue(serviceType: ServiceType): string;
    value(): string;
}

declare class AbstractRfcFilter {
    private readonly _value?;
    protected constructor(_value?: Rfc | undefined);
    static create(value: string): AbstractRfcFilter;
    static empty(): AbstractRfcFilter;
    static check(value: string): boolean;
    isEmpty(): boolean;
    getValue(): string;
    toJSON(): string | undefined;
}

declare class RfcMatch extends AbstractRfcFilter {
}

declare class RfcMatches {
    private readonly _items;
    private readonly _count;
    constructor(...items: RfcMatch[]);
    static create(...items: RfcMatch[]): RfcMatches;
    static createFromValues(...values: string[]): RfcMatches;
    isEmpty(): boolean;
    getFirst(): RfcMatch;
    count(): number;
    [Symbol.iterator](): Iterable<RfcMatch>;
    itemsToArray(): RfcMatch[];
    toJSON(): RfcMatch[];
}

declare class RfcOnBehalf extends AbstractRfcFilter {
}

declare class Uuid {
    private readonly _value;
    constructor(_value: string);
    static create(value: string): Uuid;
    static empty(): Uuid;
    static check(value: string): boolean;
    isEmpty(): boolean;
    getValue(): string;
    toJSON(): string;
}

/**
 * This class contains all the information required to perform a query on the SAT Web Service
 */
declare class QueryParameters {
    private _period;
    private _downloadType;
    private _requestType;
    private _documentType;
    private _complement;
    private _documentStatus;
    private _uuid;
    private _rfcOnBehalf;
    private _rfcMatches;
    private _serviceType?;
    constructor(_period: DateTimePeriod, _downloadType: DownloadType, _requestType: RequestType, _documentType: DocumentType, _complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>, _documentStatus: DocumentStatus, _uuid: Uuid, _rfcOnBehalf: RfcOnBehalf, _rfcMatches: RfcMatches);
    static create(period?: DateTimePeriod, downloadType?: DownloadType, requestType?: RequestType): QueryParameters;
    hasServiceType(): boolean;
    getServiceType(): ServiceType;
    getPeriod(): DateTimePeriod;
    getDownloadType(): DownloadType;
    getRequestType(): RequestType;
    getDocumentType(): DocumentType;
    getComplement(): ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>;
    getDocumentStatus(): DocumentStatus;
    getUuid(): Uuid;
    getRfcOnBehalf(): RfcOnBehalf;
    getRfcMatches(): RfcMatches;
    getRfcMatch(): RfcMatch;
    withServiceType(serviceType: ServiceType): this;
    withPeriod(period: DateTimePeriod): this;
    withDownloadType(downloadType: DownloadType): this;
    withRequestType(requestType: RequestType): this;
    withDocumentType(documentType: DocumentType): this;
    withComplement(complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>): this;
    withDocumentStatus(documentStatus: DocumentStatus): this;
    withUuid(uuid: Uuid): this;
    withRfcOnBehalf(rfcOnBehalf: RfcOnBehalf): this;
    withRfcMatches(rfcMatches: RfcMatches): this;
    withRfcMatch(rfcMatch: RfcMatch): this;
    toJSON(): {
        serviceType: ServiceType | undefined;
        period: DateTimePeriod;
        downloadType: DownloadType;
        requestType: RequestType;
        documentType: DocumentType;
        complement: ComplementoInterface<ComplementoCfdiTypes | ComplementoRetencionesTypes>;
        documentStatus: DocumentStatus;
        uuid: Uuid;
        rfcOnBehalf: RfcOnBehalf;
        rfcMatches: RfcMatches;
    };
}

/**
 * The implementors must create the request signed ready to send to the SAT Web Service Descarga Masiva
 * The information about owner like RFC, certificate, private key, etc. are outside the scope of this interface
 */
type RequestBuilderInterface = {
    /**
     * Creates an authorization signed xml message
     *
     * @param created - must use SAT format 'Y-m-dTH:i:s.000T'
     * @param expires - must use SAT format 'Y-m-dTH:i:s.000T'
     * @param securityTokenId - if empty, the authentication method will create one by its own
     */
    authorization(created: DateTime, expires: DateTime, securityTokenId: string): string;
    /**
     * Creates a query signed xml message
     *
     * @throws RequestBuilderException
     */
    query(queryParameters: QueryParameters): string;
    /**
     * Creates a verify signed xml message
     *
     * @throws RequestBuilderException
     */
    verify(requestId: string): string;
    /**
     * Creates a download signed xml message
     *
     * @throws RequestBuilderException
     */
    download(packageId: string): string;
};

declare class FielRequestBuilder implements RequestBuilderInterface {
    private readonly _fiel;
    constructor(_fiel: Fiel);
    private static createXmlSecurityToken;
    getFiel(): Fiel;
    authorization(created: DateTime, expires: DateTime, securityTokenId?: string): string;
    query(queryParameters: QueryParameters): string;
    verify(requestId: string): string;
    download(packageId: string): string;
    private createSignature;
    private createSignedInfoCanonicalExclusive;
    private createKeyInfoData;
    private parseXml;
}

declare abstract class RequestBuilderException extends Error {
}

declare class StatusCode {
    private readonly _code;
    private readonly _message;
    constructor(_code: number, _message: string);
    /**
     * Contains the value of "CodEstatus"
     */
    getCode(): number;
    /**
     * Contains the value of "Mensaje"
     */
    getMessage(): string;
    /**
     * Return true when "CodEstatus" is success
     * The only success code is "5000: Solicitud recibida con éxito"
     */
    isAccepted(): boolean;
    toJSON(): {
        code: number;
        message: string;
    };
}

declare class DownloadResult {
    private readonly _status;
    private readonly _packageContent;
    private readonly _packageSize;
    constructor(_status: StatusCode, _packageContent: string);
    /**
     * Status of the download call
     */
    getStatus(): StatusCode;
    /**
     * If available, contains the package contents
     */
    getPackageContent(): string;
    /**
     * If available, contains the package contents length in bytesF
     */
    getPackageSize(): number;
    toJSON(): {
        status: StatusCode;
        length: number;
    };
}

declare class QueryResult {
    private readonly _status;
    private readonly _requestId;
    constructor(statusCode: StatusCode, requestId: string);
    /**
     * Status of the verification call
     */
    getStatus(): StatusCode;
    /**
     * If accepted, contains the request identification required for verification
     */
    getRequestId(): string;
    toJSON(): {
        status: StatusCode;
        requestId: string;
    };
}

type CodeRequestTypes = 'Accepted' | 'Exhausted' | 'MaximumLimitReaded' | 'EmptyResult' | 'Duplicated';
declare class CodeRequest {
    protected static readonly VALUES: {
        code: number;
        name: string;
        message: string;
    }[];
    private readonly value;
    /**
     *
     * @param index - if assign by Values.code
     */
    constructor(index: number);
    static getEntries(): {
        code: number;
        name: string;
        message: string;
    }[];
    getEntryValueOnUndefined(): {
        code?: number;
        name: string;
        message: string;
    };
    getEtryValueOnUndefined(): {
        name: string;
        message: string;
    };
    getEntryId(): string;
    getMessage(): string;
    getValue(): number | undefined;
    isTypeOf(type: CodeRequestTypes): boolean;
    toJSON(): {
        value: number | undefined;
        message: string;
    };
}

type StatusRequestTypes = 'Accepted' | 'InProgress' | 'Finished' | 'Failure' | 'Rejected' | 'Expired';
declare class StatusRequest {
    protected static readonly VALUES: {
        code: number;
        name: string;
        message: string;
    }[];
    private readonly value;
    /**
     *
     * @param index - if number is send assign value by array index of VALUES, values from 0 to 5 if string is send find value by Values.name
     */
    constructor(index: number | string);
    static getEntriesArray(): {
        name: string;
        message: string;
    }[];
    getEntryValueOnUndefined(): {
        code?: number;
        name: string;
        message: string;
    };
    getEntryId(): string;
    getValue(): number | undefined;
    isTypeOf(type: StatusRequestTypes): boolean;
    toJSON(): {
        value: number | undefined;
        message: string;
    };
}

declare class VerifyResult {
    private readonly _status;
    private readonly _statusRequest;
    private readonly _codeRequest;
    private readonly _numberCfdis;
    private readonly _packagesIds;
    constructor(statusCode: StatusCode, statusRequest: StatusRequest, codeRequest: CodeRequest, numberCfdis: number, ...packageIds: string[]);
    /**
     * Status of the verification call
     */
    getStatus(): StatusCode;
    /**
     * Status of the query
     */
    getStatusRequest(): StatusRequest;
    /**
     * Code related to the status of the query
     */
    getCodeRequest(): CodeRequest;
    /**
     * Number of CFDI given by the query
     */
    getNumberCfdis(): number;
    /**
     * An array containing the package identifications, required to perform the download process
     */
    getPackageIds(): string[];
    countPackages(): number;
    toJSON(): {
        status: {
            code: number;
            message: string;
        };
        codeRequest: {
            value: number | undefined;
            message: string;
        };
        statusRequest: {
            value: number | undefined;
            message: string;
        };
        numberCfdis: number;
        packagesIds: string[];
    };
}

/**
 * This class contains the end points to consume the service
 * Use ServiceEndpoints.cfdi() for "CFDI regulares"
 * Use ServiceEndpoints.retenciones() for "CFDI de retenciones e información de pagos"
 *
 * @see ServiceEndpoints.cfdi()
 * @see ServiceEndpoints.retenciones()
 */
declare class ServiceEndpoints {
    private readonly _authenticate;
    private readonly _query;
    private readonly _verify;
    private readonly _download;
    private readonly _serviceType;
    constructor(_authenticate: string, _query: string, _verify: string, _download: string, _serviceType: ServiceType);
    /**
     * Create an object with known endpoints for "CFDI regulares"
     */
    static cfdi(): ServiceEndpoints;
    static retenciones(): ServiceEndpoints;
    getAuthenticate(): string;
    getQuery(): string;
    getVerify(): string;
    getDownload(): string;
    getServiceType(): ServiceType;
}

declare class Service {
    private readonly _requestBuilder;
    private readonly _webClient;
    _currentToken?: Token | undefined;
    private readonly _endpoints;
    /**
     * Client constructor of "servicio de consulta y recuperación de comprobantes"
     *
     * @param endpoints - endpoints If undefined uses CFDI endpoints
     */
    constructor(_requestBuilder: RequestBuilderInterface, _webClient: WebClientInterface, _currentToken?: Token | undefined, endpoints?: ServiceEndpoints);
    /**
     * This method will reuse the current token,
     * it will create a new one if there is none or the current token is no longer valid
     */
    obtainCurrentToken(): Promise<Token>;
    /**
     * Perform authentication and return a Token, the token might be invalid
     */
    authenticate(): Promise<Token>;
    /**
     * Consume the "SolicitaDescarga" web service
     */
    query(parameters: QueryParameters): Promise<QueryResult>;
    /**
     * Consume the "VerificaSolicitudDescarga" web service
     */
    verify(requestId: string): Promise<VerifyResult>;
    download(packageId: string): Promise<DownloadResult>;
    private consume;
}

declare class AuthenticateTranslator extends InteractsXmlTrait {
    createTokenFromSoapResponse(content: string): Token;
    createSoapRequest(requestBuilder: RequestBuilderInterface): string;
    createSoapRequestWithData(requestBuilder: RequestBuilderInterface, since: DateTime, until: DateTime, securityToken?: string): string;
}

declare class DownloadTranslator extends InteractsXmlTrait {
    createDownloadResultFromSoapResponse(content: string): DownloadResult;
    createSoapRequest(requestBuilder: RequestBuilderInterface, packageId: string): string;
}

declare class QueryTranslator extends InteractsXmlTrait {
    createQueryResultFromSoapResponse(content: string): QueryResult;
    createSoapRequest(requestBuilder: RequestBuilderInterface, parameters: QueryParameters): string;
}

declare class VerifyTranslator extends InteractsXmlTrait {
    createVerifyResultFromSoapResponse(content: string): VerifyResult;
    createSoapRequest(requestBuilder: RequestBuilderInterface, requestId: string): string;
}

type ComplementoUndefinedTypes = 'undefined';
declare class ComplementoUndefined extends BaseEnum<ComplementoUndefinedTypes> implements ComplementoInterface<ComplementoUndefinedTypes> {
    private readonly Map;
    static create(id: ComplementoUndefinedTypes): ComplementoInterface<ComplementoUndefinedTypes>;
    static undefined(): ComplementoInterface<ComplementoUndefinedTypes>;
    label(): string;
    value(): string;
    toJSON(): string;
}

declare class WebClientException extends Error {
    private readonly _request;
    private readonly _response;
    private readonly _previous?;
    constructor(message: string, request: CRequest, response: CResponse, previous?: Error);
    getRequest(): CRequest;
    getResponse(): CResponse;
    getPrevious(): Error | undefined;
}

declare class HttpClientError extends WebClientException {
}

declare class HttpServerError extends WebClientException {
}

declare class SoapFaultError extends HttpClientError {
    private readonly _fault;
    constructor(request: CRequest, response: CResponse, fault: SoapFaultInfo, previous?: Error);
    getFault(): SoapFaultInfo;
}

declare class HttpsWebClient implements WebClientInterface {
    private readonly _fireRequestClosure?;
    private readonly _fireResponseClosure?;
    constructor(onFireRequest?: CallableFunction, onFireResponse?: CallableFunction);
    fireRequest(request: CRequest): void;
    fireResponse(response: CResponse): void;
    call(request: CRequest): Promise<CResponse>;
}

export { AbstractRfcFilter, AuthenticateTranslator, BaseEnum, CRequest, CResponse, CfdiFileFilter, CfdiPackageReader, CodeRequest, type CodeRequestTypes, ComplementoCfdi, type ComplementoCfdiTypes, type ComplementoInterface, ComplementoRetenciones, type ComplementoRetencionesTypes, ComplementoUndefined, type ComplementoUndefinedTypes, CreateTemporaryZipFileException, CsvReader, DateTime, DateTimePeriod, DocumentStatus, type DocumentStatusTypes, DocumentType, type DocumentTypeTypes, DownloadResult, DownloadTranslator, DownloadType, type DownloadTypeTypes, Fiel, FielRequestBuilder, type FileFilterInterface, FilteredPackageReader, Helpers, HttpClientError, HttpServerError, HttpsWebClient, InteractsXmlTrait, MetadataContent, MetadataFileFilter, MetadataItem, type MetadataItemInterface, MetadataPackageReader, MetadataPreprocessor, NullFileFilter, OpenZipFileException, PackageReaderException, type PackageReaderInterface, QueryParameters, QueryResult, QueryTranslator, type ReadLineInterface, RequestBuilderException, type RequestBuilderInterface, RequestType, type RequestTypeTypes, RfcMatch, RfcMatches, RfcOnBehalf, Service, ServiceConsumer, ServiceEndpoints, ServiceType, type ServiceTypeValues, SoapFaultError, SoapFaultInfo, SoapFaultInfoExtractor, StatusCode, StatusRequest, type StatusRequestTypes, ThirdPartiesExtractor, ThirdPartiesFileFilter, type ThirdPartiesInterface, ThirdPartiesRecords, Token, Uuid, VerifyResult, VerifyTranslator, WebClientException, type WebClientInterface };
