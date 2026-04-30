import { projectFiles, projectSlices } from 'archunit';
import path from 'node:path';

describe('Architecture', () => {
  jest.setTimeout(60_000);

  describe('Layered Architecture — dependency rules', () => {
    it('controllers should not depend on entity files', async () => {
      const rule = projectFiles()
        .withName('*.controller.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.entity.ts');

      await expect(rule).toPassAsync();
    });

    it('controllers should not import from typeorm directly', async () => {
      const rule = projectFiles()
        .withName('*.controller.ts')
        .shouldNot()
        .adhereTo(
          (file) => /from\s+['"]typeorm['"]/.test(file.content),
          'Controllers should not import from typeorm directly',
        );

      await expect(rule).toPassAsync();
    });

    it('services should not depend on controllers', async () => {
      const rule = projectFiles()
        .withName('*.service.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.controller.ts');

      await expect(rule).toPassAsync();
    });

    it('entities should not depend on services', async () => {
      const rule = projectFiles()
        .withName('*.entity.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.service.ts');

      await expect(rule).toPassAsync();
    });

    it('entities should not depend on controllers', async () => {
      const rule = projectFiles()
        .withName('*.entity.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.controller.ts');

      await expect(rule).toPassAsync();
    });

    it('DTOs should not depend on entities', async () => {
      const rule = projectFiles()
        .withName('*.dto.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.entity.ts');

      await expect(rule).toPassAsync();
    });

    it('DTOs should not depend on services', async () => {
      const rule = projectFiles()
        .withName('*.dto.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.service.ts');

      await expect(rule).toPassAsync();
    });

    it('DTOs should not depend on controllers', async () => {
      const rule = projectFiles()
        .withName('*.dto.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.controller.ts');

      await expect(rule).toPassAsync();
    });

    it('mappers should not depend on services', async () => {
      const rule = projectFiles()
        .withName('*.mapper.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.service.ts');

      await expect(rule).toPassAsync();
    });

    it('mappers should not depend on controllers', async () => {
      const rule = projectFiles()
        .withName('*.mapper.ts')
        .shouldNot()
        .dependOnFiles()
        .withName('*.controller.ts');

      await expect(rule).toPassAsync();
    });
  });

  describe('Naming conventions', () => {
    it('controller files should contain a class ending in "Controller"', async () => {
      const rule = projectFiles()
        .withName('*.controller.ts')
        .should()
        .adhereTo(
          (file) => /class\s+\w+Controller\b/.test(file.content),
          'Controller files must export a class whose name ends with "Controller"',
        );

      await expect(rule).toPassAsync();
    });

    it('service files should contain a class ending in "Service"', async () => {
      const rule = projectFiles()
        .withName('*.service.ts')
        .should()
        .adhereTo(
          (file) => /class\s+\w+Service\b/.test(file.content),
          'Service files must export a class whose name ends with "Service"',
        );

      await expect(rule).toPassAsync();
    });

    it('entity files should contain a class ending in "Entity"', async () => {
      const rule = projectFiles()
        .withName('*.entity.ts')
        .should()
        .adhereTo(
          (file) => /class\s+\w+Entity\b/.test(file.content),
          'Entity files must export a class whose name ends with "Entity"',
        );

      await expect(rule).toPassAsync();
    });

    it('module files should contain a class ending in "Module"', async () => {
      const rule = projectFiles()
        .withName('*.module.ts')
        .should()
        .adhereTo(
          (file) => /class\s+\w+Module\b/.test(file.content),
          'Module files must export a class whose name ends with "Module"',
        );

      await expect(rule).toPassAsync();
    });

    it('source files should follow the naming convention', async () => {
      const rule = projectFiles()
        .inFolder('src')
        .shouldNot()
        .haveName(
          /^(?!.*\.(controller|service|entity|module|mapper|dto|spec)\.ts$)(?!main\.ts$).*\.ts$/,
        );

      await expect(rule).toPassAsync();
    });
  });

  describe('Structural integrity', () => {
    it('should have no circular dependencies', async () => {
      const rule = projectFiles().inFolder('src').should().haveNoCycles();

      await expect(rule).toPassAsync();
    });

    it('layered architecture should adhere to the layer diagram', async () => {
      const diagram = path.resolve(__dirname, '..', 'architecture.puml');

      const rule = projectSlices()
        .definedBy('src/**/*.(**).ts')
        .should()
        .ignoringUnknownNodes()
        .adhereToDiagramInFile(diagram);

      await expect(rule).toPassAsync();
    });
  });
});
