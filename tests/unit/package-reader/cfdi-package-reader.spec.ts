import { readFileSync } from 'node:fs';
import { useTestCase } from '../../test-case.js';
import { CfdiFileFilter } from '#src/package-reader/internal/file-filters/cfdi-file-filter';
import { CfdiPackageReader } from '#src/package-reader/cfdi-package-reader';
import { OpenZipFileException } from '#src/package-reader/exceptions/open-zip-file-exception';
/**
 * This tests uses the Zip file located at tests/_files/zip/cfdi.zip that contains:
 *
 * __MACOSX/ // commonly generated by MacOS when open the file
 * __MACOSX/.aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml // commonly generated by MacOS when open the file
 * aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml // valid cfdi with common name
 * aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml.xml // valid cfdi with double extension (oh my SAT!)
 * 00000000-0000-0000-0000-000000000000.xml // file with correct name but not a cfdi
 * empty-file // zero bytes file
 * other.txt // file with incorrect extension and incorrect content
 *
 */
describe('cfdi package reader', () => {
  const { fileContents, filePath } = useTestCase();
  test('reader zip when the content is invalid', async () => {
    const zipContents = 'INVALID_ZIP_CONTENT';
    await expect(CfdiPackageReader.createFromContents(zipContents)).rejects.toBeInstanceOf(
      OpenZipFileException,
    );
  });
  test('reader zip when the content valid', async () => {
    const zipContents = fileContents('zip/cfdi.zip');
    const cfdiPackageReader = await CfdiPackageReader.createFromContents(zipContents);
    const temporaryFileName = cfdiPackageReader.getFilename();
    const cfdiArray = await cfdiPackageReader.cfdisToArray();
    expect(cfdiArray.length).toBe(2);
    expect(() => readFileSync(temporaryFileName)).toThrow(
      `ENOENT: no such file or directory, open '${temporaryFileName}'`,
    );
  });

  test('read zip with other files', async () => {
    const expectedNumberCfdis = 2;

    const filename = filePath('zip/cfdi.zip');
    const cfdiPackageReader = await CfdiPackageReader.createFromFile(filename);

    expect(await cfdiPackageReader.count()).toBe(expectedNumberCfdis);
  });

  test('reader zip with other files and double xml extension', async () => {
    const expectedFileNames = [
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml',
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml.xml',
    ];

    const filename = filePath('zip/cfdi.zip');
    const cfdiPackageReader = await CfdiPackageReader.createFromFile(filename);
    const fileContentsArray = await cfdiPackageReader.fileContentsToArray();

    const fileNames = fileContentsArray.map((item) => item.name);

    expect(fileNames).toStrictEqual(expectedFileNames);
  });

  test('cfdi reader obtain first file as expected', async () => {
    const expectedCfdi = fileContents('zip/cfdi.xml', 'utf8');

    const zipFileName = filePath('zip/cfdi.zip');
    const cfdiPackageReader = await CfdiPackageReader.createFromFile(zipFileName);
    const fileContentsArray = await cfdiPackageReader.fileContentsToArray();

    const cfdis = fileContentsArray.map((item) => item.content);
    expect(cfdis[0]).toBe(expectedCfdi);
  });

  test('create from file and contents', async () => {
    const filename = filePath('zip/cfdi.zip');
    const first = await CfdiPackageReader.createFromFile(filename);
    expect(first.getFilename()).toBe(filename);

    const firsts = first.fileContentsToArray();

    const contents = fileContents('zip/cfdi.zip');
    const second = await CfdiPackageReader.createFromContents(contents);
    const seconds = second.fileContentsToArray();

    expect(firsts).toStrictEqual(seconds);
  });

  const providerObtainUuidFromXmlCfdi = [
    [
      'common',
      `
            <cfdi:Complemento>
                    <tfd:TimbreFiscalDigital UUID="ff833b27-c8ab-4c44-a559-2c197bdd4067"/>
            <cfdi:Complemento/>
        `,
      'ff833b27-c8ab-4c44-a559-2c197bdd4067',
    ],
    [
      'upper case',
      `
            <cfdi:Complemento>
                <tfd:TimbreFiscalDigital UUID="FF833B27-C8AB-4C44-A559-2C197BDD4067"/>
            <cfdi:Complemento/>
        `,
      'ff833b27-c8ab-4c44-a559-2c197bdd4067',
    ],
    [
      'middle vertical content',
      `
            <cfdi:Complemento>
                <tfd:TimbreFiscalDigital a="a" UUID="ff833b27-c8ab-4c44-a559-2c197bdd4067" b="b"/>
            cfdi:Complemento/>
         `,
      'ff833b27-c8ab-4c44-a559-2c197bdd4067',
    ],
    [
      'middle vertical space',
      `
            <cfdi:Complemento>
                <tfd:TimbreFiscalDigital
                    UUID="ff833b27-c8ab-4c44-a559-2c197bdd4067"
                />
            <cfdi:Complemento/>
         `,
      'ff833b27-c8ab-4c44-a559-2c197bdd4067',
    ],
    [
      'invalid uuid',
      `
            <cfdi:Complemento>
                <tfd:TimbreFiscalDigital
                    UUID="ff833b27-ÑÑÑÑ-4c44-a559-2c197bdd4067"
                />
            <cfdi:Complemento/>
        `,
      '',
    ],
    ['empty content', '', ''],
    ['invalid xml', 'invalid xml', ''],
    ['xml without tfd', '<xml/>', ''],
    [
      'with cfdi relacionado and xmlns:tfd',
      `
            <cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"
              xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">
              <cfdi:CfdiRelacionados TipoRelacion="07">
                <cfdi:CfdiRelacionado UUID="afbef86d-d7af-4ef4-acfb-6aef8ddfa313"/>
              </cfdi:CfdiRelacionados>
              <cfdi:Complemento>
                <tfd:TimbreFiscalDigital UUID="000d04ba-18b8-4b78-b266-7fa7bdb24603"/>
              </cfdi:Complemento>
            </cfdi:Comprobante>
        `,
      '000d04ba-18b8-4b78-b266-7fa7bdb24603',
    ],
  ];
  test.each(providerObtainUuidFromXmlCfdi)(
    'provider obtain uuid from xml cfdi %s',
    (_name: string, source: string, expected: string) => {
      const uuid = CfdiFileFilter.obtainUuidFromXmlCfdi(source);
      expect(uuid).toBe(expected);
    },
  );

  test('json', async () => {
    const zipFilename = filePath('zip/cfdi.zip');
    const packageReader = await CfdiPackageReader.createFromFile(zipFilename);

    const jsonData = await packageReader.jsonSerialize();
    expect(jsonData.source).toBe(zipFilename);

    const expectedFiles = [
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml',
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.xml.xml',
    ];
    const jsonDataFiles = jsonData.files;
    expect(Object.keys(jsonDataFiles)).toStrictEqual(expectedFiles);

    const expectedCfdis = ['11111111-2222-3333-4444-000000000001'];
    const jsonDataCfdis = jsonData.cfdis;
    expect(Object.keys(jsonDataCfdis)).toStrictEqual(expectedCfdis);
  });
});
