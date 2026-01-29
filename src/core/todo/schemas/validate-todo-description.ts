type ValidadeTodoDescription = {
  success: boolean;
  errors: string[];
};

export function validateTodoDescription(description: string): ValidadeTodoDescription {
  const errors = [];

  if(description.length <= 3) {
    errors.push('Descrição precisa ter mais de 3 caracteres');
  }

  // Outras checagens

  return {
    success: errors.length === 0,
    errors
  }
}