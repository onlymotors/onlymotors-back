module.exports = {
  tratarCnpj(cnpj) {
    if (cnpj > 0) {
      cnpj = cnpj.toString()
      cnpj = "XX.XXX." + cnpj.substr(5, 3) + "/" + cnpj.substr(8, 4) + "-XX";
      return cnpj
    }
  },
  tratarCpf(cpf) {
    if (cpf > 0) {
      cpf = cpf.toString()
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
  }
}