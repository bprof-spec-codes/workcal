namespace workcal.Entities
{
    public interface ILabelRepository
    {
        Task<IEnumerable<Label>> GetAllLabelsAsync();
        Task<Label> GetLabelByIdAsync(Guid id);
        Task AddLabelAsync(Label labelEntity);
        Task UpdateLabelAsync(Label labelEntity);
        Task DeleteLabelAsync(Guid id);
        // Add additional methods specific to Label
    }
}
