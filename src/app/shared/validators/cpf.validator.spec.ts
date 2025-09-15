import { FormControl, ValidationErrors } from '@angular/forms';
import { cpfValidator } from './cpf.validator';


describe('CPF Validator', () => {
  let validator: any;

  beforeEach(() => {
    validator = cpfValidator();
  });

  describe('Valid CPFs', () => {
    it('should return null for valid CPF with mixed formatting', () => {
      const mixedFormats = [
        '111.444.77735',   // Parcialmente formatado
        '111444.777-35',   // Formato não padrão
        '111-444-777-35',  // Com hífens extras
        '111 444 777 35'   // Com espaços
      ];

      mixedFormats.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toBeNull(`Mixed format CPF ${cpf} should be valid`);
      });
    });
  });

  describe('Invalid CPFs', () => {
    it('should return error for CPFs with repeated digits', () => {
      const repeatedDigitsCpfs = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        '00000000000'
      ];

      repeatedDigitsCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });

    it('should return error for CPFs with repeated digits and formatting', () => {
      const formattedRepeatedCpfs = [
        '111.111.111-11',
        '222.222.222-22',
        '000.000.000-00'
      ];

      formattedRepeatedCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });

    it('should return error for CPFs with incorrect length', () => {
      const wrongLengthCpfs = [
        '123',              // Muito curto
        '12345',            // Muito curto
        '1234567890',       // 10 dígitos
        '123456789012',     // 12 dígitos
        '12345678901234'    // Muito longo
      ];

      wrongLengthCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });

    it('should return error for CPFs with invalid check digits', () => {
      const invalidCheckDigitsCpfs = [
        '11144477736',  // Último dígito incorreto
        '11144477734',  // Último dígito incorreto
        '11144477725',  // Penúltimo dígito incorreto
        '11144487735',  // Penúltimo dígito incorreto
        '12345678900',  // Ambos dígitos verificadores incorretos
        '52998224726',  // Último dígito incorreto
        '04765711109'   // Último dígito incorreto
      ];

      invalidCheckDigitsCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });

    it('should return error for CPFs with invalid first check digit only', () => {
      const invalidFirstCheckCpfs = [
        '11144477745',  // Primeiro dígito verificador incorreto
        '52998224735',  // Primeiro dígito verificador incorreto
        '04765711118'   // Primeiro dígito verificador incorreto
      ];

      invalidFirstCheckCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });

    it('should return error for CPFs with invalid second check digit only', () => {
      const invalidSecondCheckCpfs = [
        '11144477736',  // Segundo dígito verificador incorreto
        '52998224724',  // Segundo dígito verificador incorreto
        '04765711107'   // Segundo dígito verificador incorreto
      ];

      invalidSecondCheckCpfs.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });
  });

  describe('Empty and null values', () => {
    it('should return null for null value', () => {
      const control = new FormControl(null);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const control = new FormControl('');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for string with only spaces', () => {
      const control = new FormControl('   ');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for string with only special characters', () => {
      const specialChars = [
        '...-',
        '()[]',
        '---',
        '...',
        '/\\',
        '!@#$%'
      ];

      specialChars.forEach(value => {
        const control = new FormControl(value);
        const result = validator(control);
        expect(result).toBeNull(`Value "${value}" should be treated as empty`);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle CPFs with various special characters mixed', () => {
      const mixedSpecialChars = [
        '111.444.777-35',     // Formato padrão - válido
        '111/444/777-35',     // Com barras
        '111(444)777-35',     // Com parênteses
        '111[444]777.35',     // Com colchetes
        '111 444 777 35',     // Com espaços
        '111_444_777_35'      // Com underscores
      ];

      // Primeiro deve ser válido
      const control1 = new FormControl(mixedSpecialChars[0]);
      expect(validator(control1)).toBeNull();

      // Os outros também devem ser válidos (caracteres especiais são removidos)
      for (let i = 1; i < mixedSpecialChars.length; i++) {
        const control = new FormControl(mixedSpecialChars[i]);
        const result = validator(control);
        expect(result).toBeNull(`CPF with special chars ${mixedSpecialChars[i]} should be valid`);
      }
    });

    it('should return error for strings that become invalid after removing non-digits', () => {
      const invalidAfterCleanup = [
        'ABC123456789',      // Letras no início
        '123456789ABC',      // Letras no final
        '12345ABC67890',     // Letras no meio
        '123.456.789-0X'     // Letra no dígito verificador
      ];

      invalidAfterCleanup.forEach(cpf => {
        const control = new FormControl(cpf);
        const result = validator(control);
        expect(result).toEqual({ cpfInvalid: true });
      });
    });
  });

  describe('Performance and consistency', () => {
    it('should consistently validate the same CPF multiple times', () => {
      const cpf = '11144477735';
      const control = new FormControl(cpf);

      // Testa múltiplas vezes para garantir consistência
      for (let i = 0; i < 100; i++) {
        const result = validator(control);
        expect(result).toBeNull();
      }
    });

    it('should handle large batch of CPFs efficiently', () => {
      const startTime = Date.now();
      const validCpfs = [
        '11144477735',
        '52998224725',
        '04765711108',
        '77033259504',
        '35286371508'
      ];
      
      // Testa 1000 validações
      for (let i = 0; i < 200; i++) {
        validCpfs.forEach(cpf => {
          const control = new FormControl(cpf);
          validator(control);
        });
      }
      
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      
      // Deve ser rápido (menos de 1 segundo para 1000 validações)
      expect(elapsed).toBeLessThan(1000);
    });
  });

  describe('Return value structure', () => {
    it('should return exactly { cpfInvalid: true } for invalid CPFs', () => {
      const control = new FormControl('12345678901');
      const result = validator(control);
      
      expect(result).toEqual({ cpfInvalid: true });
      expect(Object.keys(result!).length).toBe(1);
      expect(result!.cpfInvalid).toBe(true);
    });

    it('should return exactly null for valid CPFs', () => {
      const control = new FormControl('11144477735');
      const result = validator(control);
      
      expect(result).toBe(null);
      expect(result).not.toEqual({});
      expect(result).not.toEqual(undefined);
    });
  });

  describe('Integration with FormControl', () => {
    it('should work correctly when used with FormControl validation', () => {
      const control = new FormControl('', [cpfValidator()]);
      
      // Vazio deve ser válido (null)
      expect(control.valid).toBe(true);
      expect(control.errors).toBeNull();
      
      // CPF inválido
      control.setValue('12345678901');
      expect(control.valid).toBe(false);
      expect(control.errors).toEqual({ cpfInvalid: true });
      
      // CPF válido
      control.setValue('11144477735');
      expect(control.valid).toBe(true);
      expect(control.errors).toBeNull();
    });

    it('should work with other validators', () => {
      const control = new FormControl('', [
        cpfValidator(),
        // Simula outro validator personalizado
        (ctrl: any) => ctrl.value?.length > 20 ? { tooLong: true } : null
      ]);
      
      // CPF válido, mas muito longo
      control.setValue('11144477735' + 'extracharacters');
      expect(control.valid).toBe(false);
      expect(control.errors).toEqual({ tooLong: true });
      
      // CPF inválido e muito longo
      control.setValue('12345678901' + 'extracharacters');
      expect(control.valid).toBe(false);
      expect(control.errors).toEqual({ 
        cpfInvalid: true, 
        tooLong: true 
      });
    });
  });
});