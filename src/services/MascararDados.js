module.exports = {
  tratarCnpj(cnpj) {
    if (cnpj > 0) {
      cnpj = cnpj.toString()
      cnpj = cnpj.padStart(14, "0");
      cnpj = "XX.XXX." + cnpj.substr(5, 3) + "/" + cnpj.substr(8, 4) + "-XX";
      return cnpj
    }
  },
  tratarCpf(cpf) {
    if (cpf > 0) {
      cpf = cpf.toString()
      cpf = cpf.padStart(11, "0");
      cpf = "XXX." + cpf.substr(3, 3) + "." + cpf.substr(6, 3) + "-XX";
      return cpf
    }
  },
  tratarTelefone(telefone) {
    telefone = telefone.toString()
    if (telefone.length === 10) {
      telefone = `(${telefone.substr(0, 2)}) XXXX-${telefone.substr(6, 4)}`
      return telefone
    }
    telefone = `(${telefone.substr(0, 2)}) XXXXX-${telefone.substr(7, 4)}`
    return telefone
  },
  tratarCep(cep) {
    cep = cep.toString()
    cep = cep.replace(/\D/g, "")
    cep = cep.padStart(8, "0");
    cep = cep.substr(0, 5) + "-" + cep.substr(5, 3)
    return cep
  }
}