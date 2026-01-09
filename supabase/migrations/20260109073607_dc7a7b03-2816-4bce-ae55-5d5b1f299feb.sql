-- Allow users to update only their own pending films
CREATE POLICY "Users can update their own pending films" 
ON public.movies 
FOR UPDATE 
TO authenticated
USING (auth.uid() = uploaded_by AND status = 'pending');

-- Allow users to delete only their own pending films
CREATE POLICY "Users can delete their own pending films" 
ON public.movies 
FOR DELETE 
TO authenticated
USING (auth.uid() = uploaded_by AND status = 'pending');