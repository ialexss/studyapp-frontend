'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { questionsApi } from '@/lib/api/questions';
import { Upload, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Question, QuestionDifficulty } from '@/lib/types';

interface BulkUploadCSVProps {
  topicId: number;
  onSuccess: () => void;
}

export function BulkUploadCSV({ topicId, onSuccess }: BulkUploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const downloadTemplate = () => {
    // Crear plantilla CSV
    const template = `question,answer,keyPoints,difficulty,tags
"¿Qué es JavaScript?","JavaScript es un lenguaje de programación...","Lenguaje interpretado|Orientado a objetos|Dinámico",medium,"JavaScript|Programación"
"¿Qué es TypeScript?","TypeScript es un superset de JavaScript...","Tipado estático|Compilado a JS|Microsoft",medium,"TypeScript|Programación"
"¿Qué es React?","React es una biblioteca de JavaScript...","Componentes|Virtual DOM|Declarativo",hard,"React|Frontend"`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_preguntas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Por favor selecciona un archivo CSV válido');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const parseCSV = (text: string): Partial<Question>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const questions: Partial<Question>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Parse CSV line respecting quotes
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const question: Partial<Question> = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/^"|"$/g, '').trim();
        
        switch (header) {
          case 'question':
            question.question = value;
            break;
          case 'answer':
            question.answer = value;
            break;
          case 'keyPoints':
            question.keyPoints = value ? value.split('|').map(k => k.trim()) : [];
            break;
          case 'difficulty':
            question.difficulty = value as QuestionDifficulty;
            break;
          case 'tags':
            question.tags = value ? value.split('|').map(t => t.trim()) : [];
            break;
        }
      });
      
      if (question.question && question.answer) {
        questions.push(question);
      }
    }
    
    return questions;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      const questions = parseCSV(text);
      
      if (questions.length === 0) {
        setError('No se encontraron preguntas válidas en el archivo');
        setLoading(false);
        return;
      }

      await questionsApi.bulkCreate(topicId, questions);
      
      setSuccess(`✅ ${questions.length} preguntas creadas exitosamente`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las preguntas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Carga Masiva desde CSV
        </CardTitle>
        <CardDescription>
          Carga múltiples preguntas desde un archivo CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Template */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Plantilla CSV</p>
              <p className="text-xs text-muted-foreground">
                Descarga la plantilla con el formato correcto
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        {/* Format Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Formato del CSV:
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>question</strong>: Texto de la pregunta (requerido)</li>
            <li>• <strong>answer</strong>: Respuesta completa (requerido)</li>
            <li>• <strong>keyPoints</strong>: Puntos clave separados por | (opcional)</li>
            <li>• <strong>difficulty</strong>: easy, medium o hard (opcional)</li>
            <li>• <strong>tags</strong>: Etiquetas separadas por | (opcional)</li>
          </ul>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label htmlFor="csv-upload" className="text-sm font-medium">
            Seleccionar archivo CSV
          </label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Archivo seleccionado: {file.name}
            </p>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Cargando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Cargar Preguntas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
